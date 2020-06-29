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
              { title: 'One', value: 10, color: '#337ab7' },
              { title: 'Two', value: 15, color: '#449d44' },
              { title: 'Three', value: 20, color: '#fea116' },
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
            1487
           </div>
          <div className="type">
            To do
           </div>

        </div>
        <div className="solved col-md-4">
          <div className="static">
            0/1489
           </div>
          <div className="type">
            Solved
           </div>

        </div>
        <div className="processing col-md-4">
          <div className="static">
            2
           </div>
          <div className="type">
            InComplete
           </div>
        </div>
      </div>
    </div>

  )

}
export default YourProcess