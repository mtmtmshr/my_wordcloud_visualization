from wordcloud import WordCloud
import src.wakati as wakati


def generate_wordcloud(wakati_texts: list):
    concated_text = " ".join(wakati_texts)
    FONT_PATH = "/usr/local/lib/python3.6/site-packages/matplotlib/mpl-data/fonts/ttf/ipaexg.ttf"
    return WordCloud(background_color="white", width= 800, height=600, max_words=200, font_path=FONT_PATH, collocations=False).generate(concated_text)
