import {Card ,Tooltip ,Button} from 'antd'
import {HeartOutlined ,MessageOutlined ,HeartFilled } from '@ant-design/icons'
import {translateClassName, validateDisplayName} from '../helpers/utils'
import Link from 'next/link'
const QuestionItem = (props)=> {
  return(
    <div className='col-md-4  question-item'>
         
        <Card
          style={{  marginTop: 16 }}
          actions={[
          <div style={{color: '#08c'}}><MessageOutlined  style={{color: '#08c'}}/>{props.question.countComment}</div>,
           <div>
           {props.question.isWishList ? 
            <Tooltip title={props.isAuthenticated ? '' : 'Login To Add WishList'}>
              <Button type="text" 
                      disabled = { !props.isAuthenticated} className="btn_icon" 
                      icon={<HeartFilled  style={{color: '#eb2f96'}}/>} 
                      onClick = {()=>props.removeToWishList(props.question.id) }
              />
            </Tooltip> :
           <Tooltip title={props.isAuthenticated ? '' : 'Login To Add WishList'}>
               <Button type="text" 
                       disabled = { !props.isAuthenticated} 
                       className="btn_icon" 
                       icon={<HeartOutlined   style={{color: '#eb2f96'}}/>}
                       onClick = {()=>props.addToWishList(props.question.id) }
               />
           </Tooltip>
            }
          </div>,
           
          ]}
        >
          <Link href={{pathname : '/playground', query : { questionID : props.question['id']}}} as={`/playground?questionID=${props.question['id']}`}>
          <div className="question-title" title ={props.question.title}>{validateDisplayName(props.question.title)}</div>
          </Link>
          <div className ={`question-level badge-${translateClassName(props.question.level)}`}>
               {props.question.level.toUpperCase()}
          </div>
          <div className="question-category">
             {
               props.question.categories.map((value,index) => {
                if(index < 3)  {
                  return <div className="question-category-item" key = {value['id']}>
                  {value.name ? value.name : ''}
                    </div>
                 }
                
               })
             }
            
             
          </div>
        </Card>
        
    </div>
  )
}

export default QuestionItem