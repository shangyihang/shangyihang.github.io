const { useState, useRef } = React

function getTimes(time) {
  let now = new Date(time)
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hour = now.getHours();
  let fen = now.getMinutes();
  let second = now.getSeconds();
  return year + '-' + month + '-' + date + ' ' + hour + ':' + fen + ':' + second;
}

const Item = (props) => {
  let { id, name, face, content, time, itemActive } = props;

  return (
    <div className="item">
      <div className="face">
        <img src={face} />
      </div>
      <div className="content">
        <div className="tit">
          <p>
            <b>{name}:</b>
            {content}
          </p>
          <p>
            <b>{time}</b>
          </p>
        </div>
        <div className="btn" style={itemActive == '1' ? { display: 'inline-block' } : { display: 'none' }} onClick={() => props.changStatus(id, '2')}><button>标记已读</button></div>
        <div className="btn" style={itemActive == '2' ? { display: 'inline-block' } : { display: 'none' }} onClick={() => props.changStatus(id, '3')}><button>删除</button></div>
        <div className="btn" style={itemActive == '3' ? { display: 'inline-block' } : { display: 'none' }} onClick={() => props.changStatus(id, '2')}><button>恢复</button></div>
      </div>

    </div>
  )
}



const App = () => {
  // 注册的组件
  let inputTxt = useRef(null);
  let inputContent = useRef(null);

  // 设置数据
  let numActive = false;
  let [face, setFace] = useState('./head_pic/user1.jpg');
  let [num, setNum] = useState(30);
  let [faces] = useState([
    'http://localhost:3001/public/images/user1.jpg',
    'http://localhost:3001/public/images/user2.jpg',
    'http://localhost:3001/public/images/user3.jpg',
    'http://localhost:3001/public/images/user4.jpg',
    'http://localhost:3001/public/images/user5.jpg',
    'http://localhost:3001/public/images/user6.jpg',
  ]);
  let [testList, setTestList] = useState([
    {
      id: new Date().getTime(),
      face: 'http://localhost:3001/public/images/user1.jpg',
      name: '范德萨',
      content: '哇哦你得案例好棒哦',
      status: '1'
    },
    // { id: 2, name: '阿斯顿', content: '规范的个', status: '1' },
    // { id: 3, name: '浮点数', content: '幅度萨芬干撒个', status: '1' },
    // { id: 4, name: '斯蒂芬', content: '跟广泛大使馆都是', status: '1' },
  ]);
  let [itemActive, setItemActive] = useState('1');

  // 点击选中头向
  function clickFace(e) {
    // e.target.nodeName 获取点击的dom标签名；
    if (e.target.nodeName == 'IMG') {
      setFace(e.target.src)
    }
  }

  // 添加留言
  function createForm(e) {
    let name = inputTxt.current.value;
    let content = inputContent.current.value;
    if (name && content && face) {
      setTestList([...testList, { id: new Date(), name: name, face: face, content: content, status: '1' }]);
      inputTxt.current.value = '';
      inputContent.current.value = '';
      setFace('');
      setNum(30);
    } else {
      alert('请输入内容、选头像')
    }
  }

  // 清空留言
  function clearForm(e) {
    inputTxt.current.value = '';
    inputContent.current.value = '';
    setFace('');
    setNum(30)
  }

  // 监听num，判断是否是正在输入汉字
  function changeNum(e) {
    if (!numActive) {
      handleChangeContent(e)
    }
  }

  // onCompositionStart：汉字输入之前触发得事件
  // onCompositionEnd：汉字输入之后触发得事件

  // 实时修改num得值
  function handleChangeContent(e) {
    let length = e.target.value.length;
    let res = 30 - length;
    return setNum(res)
  }

  // 切换list
  function changeList(num) {
    setItemActive(num)
  }

  // 切换状态
  function changStatus(id, status) {
    setTestList(testList.map(item => {
      if (item.id == id) {
        item.status = status;
        return item;
      } else {
        return item
      }
    }))
  }

  return (
    <div className="container">
      <div className="option">
        <div className="face">
          <div className="label">头像：</div>
          <div className="right" onClick={(e) => { clickFace(e) }}>
            {
              faces.map(item => (
                <img key={item} className={face == item ? 'on' : ''} src={item} />
              ))
            }
          </div>
        </div>
        <div className="title">
          <div className="label">标题：</div>
          <div className="right">
            <input type="text" ref={inputTxt} placeholder="请输入名称" />
          </div>
        </div>
        <div className="content">
          <div className="label">内容：</div>
          <div className="right">
            <textarea 
            ref={inputContent} 
            maxLength='30' 
            onChange={changeNum} 
            onCompositionStart={(e)=> {numActive = true}} 
            onCompositionEnd={(e)=>{numActive = false;handleChangeContent(e)}}
            placeholder="请输入内容" />
            <h6>你还可以输入{num}个字！</h6>
          </div>
        </div>
        <div className="btn">
          <div className="label"></div>
          <div className="right">
            <button onClick={createForm}>添加留言</button>
            <a href="" onClick={(e) => { e.preventDefault(); clearForm() }}>清空留言</a>
          </div>
        </div>
      </div>
      <hr></hr>
      {/* 展示列表 */}
      <div className="tags">
        <div className={`tag ${itemActive == 1 ? 'on' : ''}`} onClick={(e) => changeList('1')}>未读消息</div>
        <div className={`tag ${itemActive == 2 ? 'on' : ''}`} onClick={(e) => changeList('2')}>已读消息</div>
        <div className={`tag ${itemActive == 3 ? 'on' : ''}`} onClick={(e) => changeList('3')}>回收站</div>
      </div>
      <div className="list">
        {
          testList.filter(item => item.status == itemActive).length != 0 ?
            testList.filter(item => item.status == itemActive).map(item => {
              return (
                <Item key={item.id} {...item} itemActive={itemActive} changStatus={changStatus} time={getTimes(item.id)}></Item>
              )
            })
            : <h5>暂时还没有消息哦</h5>
        }
      </div>
    </div>
  )
}



const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);