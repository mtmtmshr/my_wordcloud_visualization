import React from 'react'

interface WordResltProps {
    morph: string | undefined
    word2sentence: {[word:string]:string[]} | undefined
}

const WordReslt:React.FC<WordResltProps> = (props:WordResltProps) => {
    const { morph, word2sentence } = props;
    // const [sentences, setSentences] = useState<string[]>([])
    let sentences: string[];
    if (morph && word2sentence) {
        sentences = word2sentence[morph]
    } else {
        sentences = []
    }
    
    return (
        <div style={{ width: 350, height: 600 }} className="box-border border-2" >
            <div style={{ width: 350, height: 30 }} className="text-xl border-b-2 pl-2">
                形態素：<span className="font-black text-blue-800">{morph?.replace(/\s+/g, "")}</span> を含む文章一覧
            </div>
            
            <div style={{ width: 350, height: 570 }} className="overflow-y-scroll">
                <div>
                    {sentences.length ===0 && <p className="pl-6 text-3xl text-center pt-4 pr-8">no data</p>}
                    {sentences.map((sentence) => {
                        return (
                            <div className="border-b-2">
                                <p className="py-4 px-6">{sentence}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default WordReslt
