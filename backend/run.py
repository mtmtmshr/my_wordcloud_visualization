from flask import Flask, request, jsonify, send_file, session
import json
from flask_cors import CORS
import src.generateWordcloud as generateWordcloud
import src.wakati as wakati
import src.wordToSentence as w2s
import pickle
import os
import base64



app = Flask(__name__)


app.secret_key = os.environ['API_KEY']

cors = CORS(app, resources={"*": {"origins": "*"}})

@app.route('/image', methods=['GET'])
def get_image():
    filename = 'data/neko.jpg'
    return send_file(filename, mimetype='image/jpg')


@app.route('/morph_sentence', methods=['POST'])
def get_morph_sentence():
    word = request.form['morph']
    with open(f"./data/neko.pkl", "rb") as f:
        word_to_sentences = pickle.load(f)
    sentences = list(word_to_sentences[word])
    return json.dumps(sentences)


@app.route('/create_wordcloud', methods=['POST'])
def create_wordcloud():
    layouts = {}
    layouts["layout"] = []
    layouts["words"] = []
    text = request.form['text']
    acceptable_hinsi = request.form['acceptableHinsi']
    stopwords = request.form['stopwords']
    texts = text.split("\n")

    if "" in texts:
        texts.remove("")

    # 1行ずつ分かち書きしたものを配列に格納
    wakati_texts = wakati.mecab_texts_wakati_with_stopword(texts, acceptable_hinsi, stopwords)

    # 単語と文章の結びつけ
    word_to_sentences = w2s.word_to_sentences(wakati_texts, texts)

    # word_cloud作成と保存
    wordcloud = generateWordcloud.generate_wordcloud(wakati_texts)
    wordcloud.to_file(f"./data/result.jpg")

    for layout_data in vars(wordcloud)["layout_"]:
        layouts["layout"].append([int(layout_data[1]), int(layout_data[2][0]), int(layout_data[2][1]), int(len(layout_data[0][0])), 1 if layout_data[3] == None else 2])
        layouts["words"].append(layout_data[0][0])
    layouts["word2sentence"] = word_to_sentences

    with open('./data/result.jpg', "rb") as f:
        img_base64 = base64.b64encode(f.read()).decode('utf-8')
    layouts["wordcloud"] = img_base64
    return json.dumps(layouts)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=int(os.environ.get('PORT', 5000)))
