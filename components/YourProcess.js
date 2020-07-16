import { PieChart } from 'react-minimal-pie-chart';
import { StockOutlined } from "@ant-design/icons"
const YourProcess = (props) => {
  return (
    <div className="progress-module ">
      <div className="sidebar-title">
        <StockOutlined /> Your Process
       </div>
       <div className="process-chart">
          <PieChart
            data={[
              { title: 'To Do', value: props.exerciseOfUser.todo, color: '#337ab7' },
              { title: 'Solved', value: props.exerciseOfUser.solved, color: '#449d44' },
              { title: 'Attempted', value: props.exerciseOfUser.attempted, color: '#fea116' },
            ]}
            animate = {true}
            animationDuration = {1000}
          />
       </div>
     
      <div className="progress-hr row">

      </div>
      <div className="progress-status row">
        <div className="to-do col-md-4">
          <div className="static">
            {props.exerciseOfUser.todo}
           </div>
          <div className="type">
            To do
           </div>

        </div>
        <div className="solved col-md-4">
          <div className="static">
            {props.exerciseOfUser.solved}/{props.exerciseOfUser.total}
           </div>
          <div className="type">
            Solved
           </div>

        </div>
        <div className="processing col-md-4">
          <div className="static">
            {props.exerciseOfUser.attempted}
           </div>
          <div className="type">
            Attempted
           </div>
        </div>
      </div>
    </div>

  )

}
export default YourProcess