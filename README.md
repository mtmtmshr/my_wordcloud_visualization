# my_wordcloud_visualization

<br>
文章を入力するとWordCloudを作成します。入力は1行1文にしてください。
<br>
内部でMeCabによる形態素解析を行いますので日本語にしか対応していません。よろしくお願いします。
<br>
画像は /backend/neko.txt 内の「吾輩は猫である」の文章に対してwordcloudを作成したときのものです

<img width="1276" alt="スクリーンショット" src="https://user-images.githubusercontent.com/56148137/132624791-5ad29911-3ac6-4e43-9d3f-5d6c9932ba77.png">

## こだわり
wordcloud上の単語をクリックすることで、その単語がどの文章で出現したかを確認することができます。


https://word-cloud-visualizer.web.app/

# Usage
docker compose up --build

# 使用技術・言語・framework
React, Typescript, Flask, Python, Docker, docker-compose
