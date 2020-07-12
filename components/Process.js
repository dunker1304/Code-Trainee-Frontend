import { useEffect, useState } from "react"
import { PieChart } from 'react-minimal-pie-chart';
import  {Table} from "antd"

const columns = [
  {
    title: 'Submit time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Exercise',
    dataIndex: 'exercise',
    key: 'exercise',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Runtime',
    key: 'runtime',
    dataIndex: 'runtime'
  },
  {
    title: 'Language',
    key: 'language',
    dataIndex: 'language'
  },
];


const Process = (props) => {
  const [anpha, setAnpha] = useState(51)
  const [beta, setBeta] = useState(121)
  const [lamda, setLamda] = useState(182)
  const [fontSize, setFontSize] = useState(20)
  const [fontSize2, setFontSize2] = useState(20)

  useEffect(() => {
    if (fontSize < 80) {
      setTimeout(() => {
        setFontSize(fontSize + 0.1)
      }, 1);

    }
  }, [fontSize])

  useEffect(() => {
    if (fontSize2 < 40) {
      setTimeout(() => {
        setFontSize2(fontSize2 + 0.1)
      }, 1);

    }
  }, [fontSize2])
  return (
    <div className="process">
      <div className="container">
        <div className="status-submisson row">
          <div className="col-md-4 col-sm-12">
            <PieChart
              data={[
                { title: 'One', value: 10, color: '#337ab7' },
                { title: 'Two', value: 15, color: '#449d44' },
                { title: 'Three', value: 20, color: '#fea116' },
              ]}
              animate = {true}
              animationDuration = {5000}
              style={{width:"300px"}}
            />
          </div>
          <div className="col-md-8 col-sm-12">
            <div className="row">
              <div className="col-md-12">
                <p className="number">
                  <span className="text-success" style={{ color: "rgb(60, 118, 61)", fontSize: fontSize }}>0</span>
                  <span>/ 1505</span>
                </p>
                <h3 className="number-text"> questions solved</h3>
              </div>

            </div>
            <div className="row inner-row">
              <div className="col-md-4 col-sm-4 col-xs-12">
                <p className="number text-primary" id="total_submissions" style={{color: "rgb(60, 118, 61)", fontSize: fontSize2 }}>6</p>
                <h4 className="number-text"> total submissions</h4>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <p className="number text-success" id="ac_submissions"  style={{color: "rgb(60, 118, 61)", fontSize: fontSize2}}>0</p>
                <h4 className="number-text"> accepted submissions</h4>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-12">
                <p className="number">
                  <span className="text-success" id="ac_rate"  style={{color: "rgb(60, 118, 61)", fontSize: fontSize2}}>0.0</span>
                  <span>%</span>
                </p>
                <h4 className="number-text"> acceptance rate</h4>
              </div>
            </div>
          </div>

        </div>
        <div className = "row"> 
          <div className= " col-md-12">
              <h3 className="title-all-sub">All Submissions</h3>
              <Table columns={columns} dataSource={[]} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Process