import react from 'react';
import  Highlight from 'prism-react-renderer';
import defaultProps from 'prism-react-renderer';


interface EditorProps {
    language: any,
    children: any
}


// export const Editor = ({language, children}: EditorProps) =>{
//     return (
//         <Highlight {...defaultProps} code={children} language={language}>
//             {({ className, style, tokens, getLineProps, getTokenProps }) => (
//             <pre style={style}>
//                 {tokens.map((line, i) => (
//                 <div key={i} {...getLineProps({ line })}>
//                     <span>{i + 1}</span>
//                     {line.map((token, key) => (
//                     <span key={key} {...getTokenProps({ token })} />
//                     ))}
//                 </div>
//                 ))}
//             </pre>
//             )}
//         </Highlight>
//     )
// }
