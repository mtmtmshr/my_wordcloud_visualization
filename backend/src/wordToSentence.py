def word_to_sentences(wakati_texts: list, texts: list):
    word_to_sentences = {}
    for wakati_text, text in zip(wakati_texts, texts):
        words = set()
        for morph in wakati_text.split(" "):
            if morph in words:
                continue
            if morph in word_to_sentences.keys():
                word_to_sentences[morph].append(text)
            else:
                word_to_sentences[morph] = [text]
            words.add(morph)
    return word_to_sentences
