interface newPrompt {
    callback : () => void;
    text: string;
}
const usePrompt = () => {

    const newPrompt = ({callback, text} : newPrompt) => {
        if(window.confirm(text)){
            callback()
        }
    }

    return [ newPrompt ]

}

export { usePrompt }