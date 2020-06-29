import {Card} from 'antd'
import {HeartOutlined ,MessageOutlined ,HeartFilled } from '@ant-design/icons'
import {translateClassName} from '../helpers/utils'
const QuestionItem = (props)=> {
  return(
    <div className='col-md-4  question-item'>
        <Card
          style={{  marginTop: 16 }}
          actions={[
             <div style={{color: '#08c'}}><MessageOutlined  style={{color: '#08c'}}/>120</div>,
           <div onClick = {()=> props.question.isWishList ? props.removeToWishList(props.question.id):props.addToWishList(props.question.id)}style={{color: '#eb2f96'}}> {props.question.isWishList ? <HeartFilled  title ="remove to wishlist"style={{color: '#eb2f96'}}/>: <HeartOutlined  title = "add to wishlist" style={{color: '#eb2f96'}}/>}83</div>,
           
          ]}
        >
          <div className="question-title">{props.question.title}</div>
          <div className ={`question-level badge-${translateClassName(props.question.level)}`}>
               {props.question.level}
          </div>
          <div className="question-category">
             <div className="question-category-item">
               Array
             </div>
             <div className="question-category-item">
               Math
             </div>
          </div>
        </Card>
    </div>
  )
}

export default QuestionItem