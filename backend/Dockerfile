FROM python:3.6

ARG project_dir=/flask_back/

WORKDIR $project_dir

ADD requirements.txt $project_dir

COPY ./ $project_dir

RUN pip install -r requirements.txt

# Mecab辞書のダウンロード
RUN python -m unidic download
ENV FLASK_APP run.py

# matplotlibで日本語を使えるように。
ADD matplot_japanese_settings/ipaexg00401/ipaexg.ttf /usr/local/lib/python3.6/site-packages/matplotlib/mpl-data/fonts/ttf
RUN echo font.family : IPAexGothic >> /usr/local/lib/python3.6/site-packages/matplotlib/mpl-data/matplotlibrc

CMD ["python", "run.py"]
