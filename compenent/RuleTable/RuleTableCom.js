
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/sort-comp */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
  Select,
  message,
} from 'antd';
import '../extensions/Rulebase/source/RuleBase.css';

const enabledTrueIcon =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/规则库/enabled_open.png';
const enabledFalseIcon =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/规则库/enabled_close.png';

const arr1 = [
  '编号',
  '规则内容',
  '涉及参数',
  '企业类型',
  '规则类型',
  // '是否使能',
  // '使能时间',
  '创建时间',
];

const columnDataIndex = [
  'id',
  'content',
  'paramInclude',
  'factoryCatatory',
  'ruleType',
  // 'enabled',
  // 'enabledTime',
  'creatTime',
  // 'epcode',
];

// 最后一个不用给宽度，可以自适应
const arr3 = [60, 278, 265, 133, 150, 206, 149.5];
const arr4 = [false, true, true, true, true, true];
const ruletabel = [];
// arr1.forEach((item, index) => {
//   ruletabel.push({
//     title: item,
//     dataIndex: columnDataIndex[index],
//     // dataIndex: 'item',
//     width: arr3[index],
//     editable: arr4[index],
//     height: 45,
//   });
// });

const dataparam = [];
// let ii = 0;
// for (ii; ii < 10; ii += 1) {
//   const dataCell = {};
//   dataCell.key = ii.toString();
//   // eslint-disable-next-line no-loop-func
//   ruletabel.forEach(item => {
//     // console.log(item.dataIndex);
//     dataCell[item.dataIndex] = `item ${ii.toString()}`;
//   });
//   dataparam.push(dataCell);
// }
console.log('data', dataparam);
const { Option } = Select;
const arr2 = [
  '恒值异常',
  '陡升陡降',
  '满屏跳',
  '设限值',
  '关联度异常',
  '去除率异常',
  '设备异常',
  '数据超范围',
];
const selection = [];
arr2.forEach(item => {
  selection.push(<Option key={item}>{item}</Option>);
});
const arr5 = ['污水厂', '生物发电厂', '火电厂'];
const factoryCatatoryselection = [];
arr5.forEach(item => {
  factoryCatatoryselection.push(<Option key={item}>{item}</Option>);
});

const myDate = new Date();
myDate.getYear(); // 获取当前年份(2位)
myDate.getFullYear(); // 获取完整的年份(4位,1970-????)
myDate.getMonth(); // 获取当前月份(0-11,0代表1月)
myDate.getDate(); // 获取当前日(1-31)
myDate.getDay(); // 获取当前星期X(0-6,0代表星期天)
myDate.getTime(); // 获取当前时间(从1970.1.1开始的毫秒数)
myDate.getHours(); // 获取当前小时数(0-23)
myDate.getMinutes(); // 获取当前分钟数(0-59)
myDate.getSeconds(); // 获取当前秒数(0-59)
myDate.getMilliseconds(); // 获取当前毫秒数(0-999)
myDate.toLocaleDateString(); // 获取当前日期
// const mytime = myDate.toLocaleTimeString(); // 获取当前时间
const seperator1 = '-';
const seperator2 = ':';
const month = myDate.getMonth() + 1;
const mytime = `${myDate.getFullYear() +
  seperator1 +
  month +
  seperator1 +
  myDate.getDate()} ${myDate.getHours()}${seperator2}${myDate.getMinutes()}${seperator2}${myDate.getSeconds()}`;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    // eslint-disable-next-line react/prop-types
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    if (this.props.inputType === 'select-factoryCatatory') {
      return (
        <Select
          style={{ width: '120px' }}
          dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
          allowClear
          placeholder="企业类型"
        >
          {factoryCatatoryselection}
        </Select>
      );
    }
    if (this.props.inputType === 'select-ruleType') {
      return (
        <Select
          style={{ width: '135px' }}
          dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
          allowClear
          placeholder="规则类型"
        >
          {selection}
        </Select>
      );
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

/**
 * @function模块
 */
function callService(objName, serviceName, params, callback) {
  scriptUtil.excuteScriptService(
    {
      objName, // 对象实例名
      serviceName, // 服务名 //fields:列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
      params,
    },
    res => callback(res)
  );
}

/**
 * @页面适配
 */
// function adapterPage() {
//   const radio = document.documentElement.clientWidth / 1479;
//   //   console.log('radio', radio + 10);
//   document.querySelector(
//     '.mainbox'
//   ).style.transform = `scale(${radio.toString()})`;
//   document.querySelector('.mainbox').style.webkitTransformOrigin = '0% 0%';
//   document.querySelector('.mainbox').style.transformOrigin = '0% 0%'; //   if (tabIndex === 1) { //     document.querySelector('.draw_g6CsK').style.height = `${Math.floor( //       680 * radio //     ).toString()}px`; //     return; //   } //   document.querySelector('.draw_g6CsK').style.height = `${Math.floor( //     680 * radio //   ).toString()}px`; // console.log(Math.round(897*radio).toString()+'px')
// }
function adapterPage() {
  const radioWidth = document.documentElement.clientWidth / 1479;
  const radioHeight = document.documentElement.clienHeight / 780;
  //   console.log('radio', radio + 10);
  document.querySelector(
    '.mainbox'
  ).style.transform = `scale(${radioWidth.toString()})`;

  //   document.querySelector(
  //     '.mainbox'
  //   ).height = `${document.documentElement.clienHeight}px`;
  //   console.log('mainboxheight', document.querySelector('.mainbox').height);
  //   console.log('document', document.documentElement.clienHeight);
  //   document.querySelector(
  //     '.ant-table-wrapper'
  //   ).style.height = `${document.documentElement.clienHeight}px`;
  //   console.log(
  //     'ant-table-wrapperheight',
  //     document.querySelector('.ant-table-wrapper').height
  //   );
  //   //   console.log('document', document.documentElement.clienHeight);

  //   //   document.querySelector('.ant-table-wrapper').style.height =
  //   //     document.documentElement.clienHeight;

  document.querySelector('.mainbox').style.webkitTransformOrigin = '0% 0%';
  document.querySelector('.mainbox').style.transformOrigin = '0% 0%'; //   if (tabIndex === 1) { //     document.querySelector('.draw_g6CsK').style.height = `${Math.floor( //       680 * radio //     ).toString()}px`; //     return; //   } //   document.querySelector('.draw_g6CsK').style.height = `${Math.floor( //     680 * radio //   ).toString()}px`; // console.log(Math.round(897*radio).toString()+'px')
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataparam: '',
      editingKey: '',
      count: dataparam.length,
    };
    this.enabledinit();
    this.init();
    console.log('statecount', dataparam);
  }

  componentDidMount() {
    this.initRenderTable();
    const oobj = this.parmseToObject();
    this.epcode = oobj.epcode;
    console.log('epcode', this.epcode);
    this.filterRuleBySelect();
    // adapterPage();
    // window.onresize = adapterPage;
    setTimeout(() => {
      adapterPage();
      window.onresize = adapterPage;
    }, 200);
  }

  parmseToObject = () => {
    let parmse = window.location.search;
    if (!parmse) return {};
    parmse = parmse.replace(/\?/, '').split('&');
    const obj = {};
    parmse.forEach(item => {
      const o = item.split('=');
      // eslint-disable-next-line prefer-destructuring
      obj[o[0]] = o[1];
    });
    return obj;
  };

  toggleEnabledStatic = record => {
    // console.log('toggle', record);
    const { dataparam } = this.state;
    const newData = [...dataparam];
    const presentEnabledstatic = record.enabled === '是' ? '否' : '是';
    const item = record;
    // console.log(record);
    item.enabled = presentEnabledstatic;
    newData.splice(JSON.parse(record.key), 1, item);
    this.setState({ dataparam: newData });
    // console.log('toggleEnabledStatic', item);
  };

  enabledinit = () => {
    arr1.forEach((item, index) => {
      const itemDataIndex = columnDataIndex[index];

      ruletabel.push({
        title: item,
        dataIndex: itemDataIndex,
        // dataIndex: 'item',
        width: arr3[index],
        editable: arr4[index],
        render: (text, record) => {
          const cellItemTextRow = record[itemDataIndex];
          //   console.log(record[itemDataIndex]);
          //   console.log('cellItemTextRow', cellItemTextRow.length);
          const lineMaxLen = 19;
          const lineNumber = Math.ceil(cellItemTextRow.length / lineMaxLen);
          //   console.log('lineNumber', Math.ceil(19 / lineMaxLen));
          if (lineNumber === 1) {
            return <span>{cellItemTextRow}</span>;
          }
          const textArrElement = [];
          for (let ii = 0; ii < lineNumber - 1; ii += 1) {
            // const textElement = [];
            // let textItem = cellItemTextRow
            const textItem = cellItemTextRow.slice(
              lineMaxLen * ii,
              lineMaxLen * (ii + 1)
            );
            // console.log('textArrElement');
            textArrElement.push(<div>{textItem}</div>);
            // textArrElement.push(<br />);
          }
          const textItem = cellItemTextRow.slice(
            lineMaxLen * (lineNumber - 1),
            cellItemTextRow.length
          );
          textArrElement.push(<div>{textItem}</div>);
          //   console.log('textArrElement', textArrElement);
          return <div>{textArrElement}</div>;
        },
        // height: 54,
      });
    });
    ruletabel.push({
      title: '是否使能',
      dataIndex: 'enabled',
      //   align: 'center',
      render: (text, record) => {
        // const { editingKey } = this.state;
        // const editable = this.isEditing(record);
        // eslint-disable-next-line no-unused-vars
        const { enabledStatic } = this.state;

        // let iconEnabled;
        // if (record.enabled === '是') {
        //   iconEnabled = enabledTrueIcon;
        // } else {
        //   iconEnabled = enabledFalseIcon;
        // }
        // console.log('record-Enabled', record, iconEnabled);
        return (
          <Button
            // type="text"
            className={
              record.enabled === '是'
                ? 'enabled-true-icon'
                : 'enabled-false-icon'
            }
            // src={record.enabled === '是' ? enabledTrueIcon : enabledFalseIcon}
            onClick={() => {
              this.toggleEnabledStatic(record);
              this.info();
            }}
          />
        );
      },
    });
    let ii = 0;
    for (ii; ii < 10; ii += 1) {
      const dataCell = {};
      dataCell.key = ii.toString();
      // eslint-disable-next-line no-loop-func
      ruletabel.forEach(item => {
        // console.log('record', item);
        // console.log(item.dataIndex);
        if (item.dataIndex === 'enabled') {
          //   console.log(dataCell[item.dataIndex]);
          dataCell[item.dataIndex] = '是';
        } else {
          dataCell[item.dataIndex] = `item ${ii.toString()}`;
        }
      });
      dataparam.push(dataCell);
    }
  };

  init = () => {
    ruletabel.push({
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  onClick={() => this.save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="确定取消吗?"
              onConfirm={() => this.cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div>
            <a
              className="a-edit"
              disabled={editingKey !== ''}
              onClick={() => this.edit(record)}
            >
              编辑
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Popconfirm
              title="确定删除吗?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a className="a-delete">删除</a>
            </Popconfirm>
          </div>
        );
      },
    });
  };

  initRenderTable = () => {
    const objName = 'RuleDepot';
    const serviceName = 'InitRenderTable';
    const params = '';
    callService(objName, serviceName, params, res => {
      //   console.log('initRenderTable', res.result);
      //   console.log('this.state.dataparam', this.state.dataparam);

      if (res.code === '200') {
        // eslint-disable-next-line no-unused-vars
        const count = res.result.length;
        // const count = 2;
        // console.log('res.code', res.result);
        this.setState({
          //   dataparam: res.result,

          count: res.result.length,
        });
      }
    });

    // scriptUtil.excuteScriptService(
    //   {
    //     objName: 'RuleDepot', // 对象实例名
    //     serviceName: 'InitRenderTable', // 服务名 //fields:列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
    //     params: '',
    //   },
    //   res => {
    //     console.log('initRenderTable', res.result);
    //     console.log('this.state.dataparam', this.state.dataparam);

    //     if (res.code === '200') {
    //       const count = res.result.length;
    //       console.log('res.code', res.result);
    //       this.setState({
    //         dataparam: res.result,
    //         count,
    //       });
    //     }
    //   }
    // );
  };

  //   回调函数组
  info = () => {
    message.info('操作成功');
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    // const { count } = this.state;
    this.setState({
      editingKey: '',
      dataparam: this.recordEditSave,
      //   count: count - 1,
    });
  };

  handleAdd = () => {
    const { dataparam, count } = this.state;
    // const key = count;
    // const midddleData = [...this.state.dataparam];
    // const index = midddleData.findIndex(item => key === item.key);
    // const item = midddleData[index];
    const newData = {
      key: count.toString(),
      id: (count + 1).toString(),
      //   epcode: this.epcode,
      content: '',
      paramInclude: '',
      factoryCatatory: '',
      ruleType: '',
      enabled: '',
      // enabledTime: '',
      creatTime: mytime,
    };
    this.setState({
      dataparam: [...dataparam, newData],
      //   count: count + 1,
    });
    this.edit(newData);
    console.log('handleAddCount', count);
  };

  handleDelete = key => {
    // const { count } = this.state;
    // eslint-disable-next-line react/no-access-state-in-setstate
    // const dataSource = [...this.state.dataparam];
    // const index = key;
    // console.log('index', index);
    // const middlearr = {};
    // middlearr.push(dataparam.index);
    // console.log('middlearr', middlearr);
    const newData = [...this.state.dataparam];
    const index = newData.findIndex(item => key === item.key);
    const item = newData[index];
    console.log('item', item);
    const objName = 'RuleDepot';
    const serviceName = 'DeleteDataTableEntries';
    const params = { id: item.id };
    callService(objName, serviceName, params, res => {
      if (res.code === '200') {
        this.setState({
          dataparam: newData.filter(item => item.key !== key),
        });
      }
    });
    // console.log('key', key);
    // this.setState({
    // dataparam: dataSource.filter(item => item.key !== key),
    //   count: count - 1,
    // });
    // console.log(
    //   'handleDelete.dataparam',
    //   dataSource.filter(item => item.key !== key)
    // );
    console.log('handleDeleteCount', this.state.count);
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const { count } = this.state;
      const newData = [...this.state.dataparam];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        if (count === parseInt(key, 10)) {
          console.log('count === parseInt(key, 10)');
          const objName = 'RuleDepot';
          const serviceName = 'AddDataTableEntry';
          // eslint-disable-next-line no-param-reassign
          row.epcode = this.epcode;
          // eslint-disable-next-line no-param-reassign
          row.id = count + 1;
          const params = row;
          console.log('row', row);
          callService(objName, serviceName, params, res => {
            if (res.code === '200') {
              this.setState({
                // dataparam: res.result,
                dataparam: newData,
                editingKey: '',
                count: count + 1,
              });
            }
          });
        } else if (count !== parseInt(key, 10)) {
          // eslint-disable-next-line no-undef
          const objName = 'RuleDepot';
          const serviceName = 'UpdateDataTableEntry';
          const params = {
            where: { id: item.id },
            // eslint-disable-next-line no-undef
            update: row,
          };
          callService(objName, serviceName, params, res => {
            if (res.code === '200') {
              this.setState({
                // dataparam: res.result,
                dataparam: newData,
                editingKey: '',
                count,
              });
            }
          });
        }
        // this.setState({
        //   dataparam: newData,
        //   editingKey: '',
        //   // count: newData.length,
        //   count: count === parseInt(key, 10) ? count + 1 : count,
        // });
        // console.log('index > -1', count);
      }
    });
  }

  edit(record) {
    this.recordEditSave = this.state.dataparam;
    this.setState({ editingKey: record.key });
  }

  onBlur = () => {
    // console.log('blur');
  };

  onFocus = () => {
    // console.log('focus');
  };

  onSearch = value => {
    this.paramsInputValue = value;
    // console.log(value);
    this.filterRuleBySelect();
  };

  /**
   * 筛选模块
   * @returns
   */
  //   epcodesearch = epcode => {
  //     this.epcodevalue = epcode;
  //     this.filterRuleBySelect();
  //   };

  ruleTypeChange = value => {
    // console.log(`selected ${value}`);
    this.ruleTypeValue = value;
    this.filterRuleBySelect();
  };

  filterRuleBySelect = () => {
    const objName = 'RuleDepot';
    const serviceName = 'filterRuleBySelect';
    const params = {
      ruleTypeFilter: this.ruleTypeValue,
      paramsValueFilter: this.paramsInputValue,
      epcodeFilter: this.epcode,
    };
    callService(objName, serviceName, params, res => {
      if (res.code === '200') {
        // console.log('res.code', res.result);
        this.setState({
          dataparam: res.result,
          //   count: res.result.length,
        });
      }
    });
  };

  render() {
    const { dataparam, editingKey } = this.state;
    // eslint-disable-next-line no-undef
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = ruletabel.map(col => {
      if (!col.editable) {
        return col;
      }
      let inputValueType;
      if (col.dataIndex === 'id') {
        inputValueType = 'number';
      } else if (col.dataIndex === 'factoryCatatory') {
        inputValueType = 'select-factoryCatatory';
      } else if (col.dataIndex === 'ruleType') {
        inputValueType = 'select-ruleType';
      } else {
        inputValueType = 'text';
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'id' ? 'number' : 'text',
          inputType: inputValueType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const typeSelection = (
      <Select
        // className="select1"
        style={{ width: 128 }}
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        onChange={this.ruleTypeChange}
        placeholder="规则类型"
      >
        {selection}
      </Select>
    );

    const { Search } = Input;
    // eslint-disable-next-line no-console

    const Searchtion = (
      <Search
        placeholder="搜索"
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
      />
    );

    return (
      <EditableContext.Provider value={this.props.form}>
        {/* <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button> */}
        <div className="mainbox">
          <div className="topbox">
            <span className="textbox">规则管理</span>
          </div>
          <div className="middlebox">
            <div className="middle1box">{typeSelection}</div>
            <div className="middle2box">{Searchtion}</div>
            <div className="middle3box">
              <Button type="text" className="btn-upadte">
                <span className="updatetext">刷新</span>
              </Button>
            </div>
            <div className="middle4box">
              <Button
                type="text"
                className="btn-task"
                onClick={this.handleAdd}
                disabled={editingKey !== ''}
              >
                <span className="tasktext">添加</span>
              </Button>
            </div>
          </div>
          <div className="bottombox">
            {/* <Form ref={this.yyFormRef} component={false}> */}
            <Table
              components={components}
              bordered
              pagination={false}
              columns={columns}
              dataSource={dataparam}
              rowClassName="editable-row"
              //   scroll={{y:240}}
              // pagination={{
              //   onChange: this.cancel,
              //   // total: 5,
              // }}
              size="small"
            />
            {/* </Form> */}
          </div>
        </div>
        {/* <Table
          components={components}
          bordered
          dataSource={this.state.dataparam}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        /> */}
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
// ReactDOM.render(<EditableFormTable />, mountNode);
const css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
.enabled-true-icon,.enabled-true-icon:hover,.enabled-true-icon:focus,.enabled-true-icon:active{
    width: 50px;
    height: 30px;
    border: 0px;
    background: url(${enabledTrueIcon}) center;
    background-repeat:no-repeat;
    background-size: cover;

}
.enabled-false-icon,.enabled-false-icon:hover,.enabled-false-icon:focus,.enabled-false-icon:active{
    width: 50px;
    height: 30px;
    border: 0px;
    background: url(${enabledFalseIcon}) center;
    background-repeat:no-repeat;
    background-size: cover;
}
/*.ant-table-thead > tr > th{
white-space:wrap;
}
.ant-table-row td{
white-space:wrap;
}*/
table{table-layout: fixed!important;}
td{
// max-width:95%!important;
word-break: break-all!important;
white-space:pre-wrad!important;
word-wrap:break-word!important;
}
::-webkit-scrollbar-track {
    margin: 4px 0;
    border-radius: 8px;
    background: white;
}
`;

document.getElementsByTagName('head')[0].appendChild(css);
