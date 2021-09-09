import MeCab
import re


def mecab_wakati_with_stopword(text: str, acceptable_hinsi, stopwords):
    tagger = MeCab.Tagger()
    node = tagger.parseToNode(text)
    wakati_words = []
    while node:
        cols = node.feature.split(",")
        if cols[0] == "BOS/EOS" or len(cols) <= 7:
            node = node.next
            continue
        hinsi = cols[0]
        origin = node.surface
        if hinsi in acceptable_hinsi and origin not in stopwords:
            wakati_words.append(origin)
        node = node.next

    return " ".join(wakati_words)


def mecab_texts_wakati_with_stopword(texts: list, acceptable_hinsi, stopwords):
    wakati_texts = []
    for text in texts:
        wakati_text = mecab_wakati_with_stopword(text, acceptable_hinsi, stopwords)
        wakati_texts.append(wakati_text)
    return wakati_texts


def mecab_wakati(text: str):
    tagger = MeCab.Tagger("-Owakati")
    return tagger.parse(text.rstrip())


def mecab_texts_wakati(texts: list):
    wakati_texts = []
    for text in texts:
        wakati_text = mecab_wakati(text)
        wakati_texts.append(wakati_text)
    return wakati_texts


