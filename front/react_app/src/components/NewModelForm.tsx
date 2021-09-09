import React, { useState } from 'react'
import {
    useHistory,
    useLocation,
} from 'react-router-dom';

interface checkBoxProps {
    id:string,
    value: string,
    checked: boolean,
    onChange: (prm: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckBox = (props:checkBoxProps ) => {
    const { id, value, checked, onChange } = props;
    return (
        <input
            id={id}
            type="checkbox"
            name="inputNames"
            checked={checked}
            onChange={onChange}
            value={value}
        />
    )
}

const NewModelForm:React.FC = () => {
    const [text, setText] = useState<string>("")
    const [stopWordText, setStopWordText] = useState<string>("")
    const [delimiter, setDelimiter] = useState<string>("\n")
    const history = useHistory()
    const [checkedHinsi, setCheckedItems] = useState<{ [item: string]: boolean}>({"名詞": true, "動詞":true, "形容詞":true})
    const hinsiList = ["名詞", "動詞", "形容詞", "形容動詞", "副詞", "助詞", "感動詞", "助動詞"]
    const [textError, setTextError] = useState(false)
    const [hinsiError, setHinsiError] = useState(false)
    const location:any = useLocation()

    const handleSubmit = () => {
        // checkedHinsiのvalueがtrueの品詞だけ取り出し
        const checkedHinsiList = Object.keys(Object.fromEntries(
            Object.entries( checkedHinsi )
            .filter( ( [ _, value ] ) => value )
        ))

        let stopwords:string[];
        if (delimiter === "\\n") {
            stopwords = stopWordText.split(/\r\n|\n/);
        } else {
            stopwords = stopWordText.split(delimiter)
        }

        if (text !== "" && checkedHinsiList.length !== 0) {
            history.push({
                pathname: '/Result',
                state: {
                    text: text,
                    hinsiList: checkedHinsiList,
                    stopwords: stopwords
                },
            })
        } 
        if ( text === "" ){
            setTextError(true)
        } else {
            setTextError(false)
        }

        if ( checkedHinsiList.length === 0 ) {
            setHinsiError(true)
        } else {
            setHinsiError(false)
        }
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCheckedItems({
            ...checkedHinsi,
            [e.target.value]: e.target.checked
        })
    }
    return (
        <div className="w-screen pt-10">
            <div className="flex flex-col space-y-4 w-8/12 m-auto">
                { location?.state?.error && <span className="text-red-500">ERROR WordCloudの作成に失敗しました</span> }
                <p className="text-2xl">{textError ? <span className="text-red-500">ERROR 文章を入力してください</span> : <span>文章を入力してください</span> }</p>
                <textarea style={{height:400}} onChange={(e) => setText(e.target.value)} className="box-border border-2" placeholder="吾輩は猫である。&#13;&#10;名前はまだない。"></textarea>
                <div className="flex justify-center items-center box-border border-2 p-2 h-56">
                    <p className="pr-4 w-48">ストップワード</p>
                    <textarea className="box-border border-2 w-full" style={{height:150}} onChange={(e) => setStopWordText(e.target.value)}></textarea>
                    <p className="pl-4 w-36">区切り文字</p>
                    <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="w-16 box-border border-2">
                        <option value="\n">\n</option>
                        <option value=",">,</option>
                        <option value="、">、</option>
                    </select>
                </div>
                {hinsiError && <p className="text-red-500">少なくとも1つは品詞を選択してください</p>}
                <div className="flex justify-center items-center box-border border-2 p-2">
                    <p className="pr-4 w-40">表示する品詞</p>
                    {hinsiList.map((hinsi, index) => {
                        index = index + 1
                        return (
                            <label htmlFor={`id_${index}`} key={`key_${index}`} className="pr-4">
                                <CheckBox
                                    id={`id_${index}`}
                                    value={hinsi}
                                    onChange={handleChange}
                                    checked={checkedHinsi[hinsi]}
                                />
                            {hinsi}
                            </label>
                        )
                    })}
                </div>
                <div className="text-right">
                    <button type="submit" className="w-48 box-border border-2 py-4 rounded-xl" onClick={handleSubmit}>WordCloud作成!</button>
                </div>
            </div>
        </div>
    )
}

export default NewModelForm

