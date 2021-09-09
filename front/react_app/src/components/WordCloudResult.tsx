import React, {useEffect, useState} from 'react'
import axios from "axios"
import { Link } from "react-router-dom";
import WordResult from '../components/WordResult';
import {
    useHistory,
    useLocation,
} from 'react-router-dom';

const CrossingNumberAlgorithm = (x:number, y:number, data:number[][]) => {
    /*
    data[i] i番目の形態素

    data[i][0]:number font-size
    data[i][1]:number y座標
    data[i][2]:number x座標 (左上が0, 0)
    data[i][3]:number len characters  Ex. "もも" -> 2
    data[i][4]:orient 横向きか。縦向きか。 (1 or 2)
    */

    let data_index = -1;

    let min_font_size = 10000;

    for ( let i=0; i<data.length; i++ ) {
        let font_size = data[i][0]
        let orient = data[i][4]
        // 横向きならx方向の長さを文字列長倍する。縦向きならｙ座標方向
        // -(font_size/7) することで余白(margin)を調整
        let x_width = orient === 1 ? data[i][3] * font_size : font_size - (font_size/7)
        let y_height = orient === 2 ? data[i][3] * font_size: font_size - (font_size/7)

        let p1 = data[i][2] // 左線
        let p2 = data[i][2] + x_width// 右線
        if ( x < p1 || x > p2 ) {
            // 四角の外
            continue
        }

        let p3 = data[i][1] // 上線
        let p4 = data[i][1] + y_height // 下線
        if ( y < p3 || y > p4 ) {
            // 四角の外
            continue
        }

        // font-sizeの小さい方を優先
        if ( min_font_size > font_size ) {
            data_index = i
            min_font_size = font_size
        }
    }
    return data_index
}

interface WordCloudProps {
    text: string[]
}
const URL = process.env.REACT_APP_API_URL

const WordCloud:React.FC<WordCloudProps> = (props:WordCloudProps) => {
    const [context, setContext] = useState<any>()
    const [useMouseOver, setUseMouseOver] = useState(true)
    const [prevMouseEventIndex, setMouseEventIndex] = useState(-1)
    const [prevClickEventIndex, setClickEventIndex] = useState(-1)
    const [clicked, setClicked] = useState(false)
    const [data, setData] = useState<number[][]>()
    const [wordData, setWordData] = useState<string[]>()
    const img01:HTMLImageElement = new Image();
    const [word, setWord] = useState<string>()
    const [src, setSrc] = useState("")
    const location:any = useLocation()
    const history = useHistory()
    const [word2sentence, setWord2sentence] = useState<{[word:string]:string[]}>()
    
    useEffect(() => {
        const getAPIData = async() => {
            
            try {
                let params = new URLSearchParams();
                params.append('text', location.state.text);
                params.append('stopwords', location.state.stopwords);
                params.append('acceptableHinsi', location.state.hinsiList);
                const result = await axios.post(`${URL}create_wordcloud`, params)
                setData(result.data["layout"])
                setWordData(result.data["words"])
                setWord2sentence(result.data["word2sentence"])
            } catch (error) {
                history.push({
                    pathname: "/",
                    state: {
                        error: "true"
                    }
                })
            }
            
            const result_image = await axios.get(
                `${URL}image`,
                {
                    'responseType': 'blob',
                    'headers': {
                        'Content-Type': 'image/jpg'
                    }

                }
            )
            let urlCreator = window.URL || window.webkitURL;
            setSrc(urlCreator.createObjectURL(result_image.data))
            
        }
        getAPIData()

        return () => { setSrc(""); setData([[]]) }
    },[history])

    useEffect(()=>{
        const canvas:HTMLCanvasElement = document.getElementById("wordcloud") as HTMLCanvasElement
        if (canvas && canvas.getContext) {
            const canvasContext = canvas.getContext("2d")
            if ( canvasContext ) {
                setContext(canvasContext)
            }
        }
        if( context!==null && context!==undefined ){
            img01.onload = () => {
                context.drawImage(img01, 0, 0, 800, 600);
            };
            img01.src = src;
        }
    },[src, context])

    const handleClick = async (e:React.MouseEvent<HTMLElement, MouseEvent>) => {
        let offsetX = e.nativeEvent.offsetX;
        let offsetY = e.nativeEvent.offsetY;
        if ( data && wordData ) {
            let data_index = CrossingNumberAlgorithm(offsetX, offsetY, data)

            // 描画の状態をリセット
            img01.src = src
            await context.drawImage(img01, 0, 0, 800, 600);
            setClicked(false)

            // （前回と同じところを指しているかつクリックされた状態）または(形態素の上意外)ならリターン
            if ( (prevClickEventIndex === data_index && clicked) || data_index === -1) {
                return
            }
            
            // クリックされた状態に変更
            setClicked(true)
            setWord(wordData[data_index])
            setClickEventIndex(data_index)

            // クリックが形態素の上なら、囲み線(赤)を表示
            let font_size = data[data_index][0]
            let orient = data[data_index][4]
            
            // 横向きならx方向の長さを文字列長倍する
            // -(font_size/7) することで余白(margin)を調整
            let x_width = orient === 1 ? data[data_index][3] * font_size: font_size - (font_size/7)

            // 縦向きの場合はyの長さに文字列長data[i][3]をかける
            let y_height = orient === 2 ? data[data_index][3] * font_size: font_size - (font_size/7)
            context.strokeStyle = "rgba(" + [255, 0, 0, 1] + ")";
            context.strokeRect(data[data_index][2], data[data_index][1], x_width, y_height);
        }
    }

    const handleMouseMove = (async (e: React.MouseEvent<HTMLElement, MouseEvent>)=>{
        // MouseOverを使わないならreturn
        if ( useMouseOver === false || clicked ) {
            return
        }

        let offsetX = e.nativeEvent.offsetX;
        let offsetY = e.nativeEvent.offsetY;
        if ( data && src ) {
            let data_index = CrossingNumberAlgorithm(offsetX, offsetY, data)
            // 前回と同じところを指していたら何もしない
            if ( prevMouseEventIndex === data_index ) {
                // MouseOverEventが起こりすぎないように100ミリ秒待機
                setUseMouseOver(false)
                await new Promise(resolve => setTimeout(resolve, 100));
                setUseMouseOver(true)
                return
            }
            else if (prevMouseEventIndex !== -1 && data_index !== prevMouseEventIndex) {
                // 形態素へのhoverがなくなったらreset
                img01.src = src
                context.drawImage(img01, 0, 0, 800, 600);
            }

            setMouseEventIndex(data_index)


            // マウスが形態素の上なら、囲み線を表示
            if( data_index !== -1 ) {
                let font_size = data[data_index][0]
                let orient = data[data_index][4]
                
                // 横向きならx方向の長さを文字列長倍する
                // -(font_size/7) することで余白(margin)を調整
                let x_width = orient === 1 ? data[data_index][3] * font_size: font_size - (font_size/7)

                // 縦向きの場合はyの長さに文字列長data[i][3]をかける
                let y_height = orient === 2 ? data[data_index][3] * font_size: font_size - (font_size/7)
                context.strokeStyle = "rgba(" + [0, 0, 255, 1] + ")";
                context.strokeRect(data[data_index][2], data[data_index][1], x_width, y_height);
            } 
        }
        // MouseOverEventが起こりすぎないように100ミリ秒待機
        setUseMouseOver(false)
        await new Promise(resolve => setTimeout(resolve, 100));
        setUseMouseOver(true)
    })
    
    const resetContext = () => {
        if ( clicked === true ) {
            return
        }

        if( context!==null && context!==undefined ){
            img01.onload = () => {
                context.drawImage(img01, 0, 0, 800, 600);
            };
            img01.src = src;
        }
    }

    return (
        <div className="flex flex-col">
            <div>
                <nav className="pl-72 py-6 text-right">
                    <Link to="/" className="box-border border-2 px-4 py-2 rounded-md">
                        New Model
                    </Link>
                </nav>
            </div>
            <div id="wordcloud-container" className="flex space-x-4">
                
                { data ?
                        <canvas 
                            id="wordcloud"
                            className="box-border border-2"
                            width={800}
                            height={600}
                            onClick={handleClick}
                            onMouseMove={(e) => handleMouseMove(e)} 
                            onMouseLeave={resetContext}
                        >
                        </canvas>
                    :
                    <div style={{width:800, height:600}} className="flex box-border border-2 items-center justify-center text-3xl">
                        <p>Loading...</p>
                    </div>
                }
                
                <div className="flex space-y-4 flex-col">
                    <WordResult morph={word} word2sentence={word2sentence} />
                </div>
            </div>
        </div>
    )
}


export default WordCloud
