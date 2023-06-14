import '../../css/group/group.css'
import { useHref, useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import { Avatar, Card, Table, Input, Button, Modal, Carousel,Divider,Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function GroupProblem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workbookList, setWorkbookList] = useState([]);
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [candiWB, setCandiWB] = useState([]);
  const columns = [
    {
      title: '문제 번호',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '문제 이름',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '티어',
      dataIndex: 'tier',
      key: 'tier',
    },
    
  ];
  const closeTag = (problem, e) => {
    e.preventDefault();
    console.log(problem)
    setCandiWB(candiWB.filter(wb => wb.number !== problem.number));
  }
  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeProblem = (event) => {
    setProblem(event.target.value);
  };

  const addProblem = () => {
    let is_duplicated = false;
    candiWB.map(wb=> {
      if (wb.number==problem) is_duplicated=true;
    })
    const apiUrl = `http://localhost:8000/api/workbook/tag/`
    axios.get(apiUrl, { params: {id:problem}})
      .then((response)=>{
        const {data} = response
        console.log(data)
        if (data != "404"){
          const {id,title,number,color,url} = data
          const problemInfo = {id:id,title:title,number:number,color:color,url:url}
          if (!is_duplicated) {
            setCandiWB([...candiWB,problemInfo])
          }
        }
      })
      .catch((error)=>{
        console.log(error)
      })
    
    console.log(candiWB);
  }

  useEffect(() => {
    const apiUrl = `http://localhost:8000/api/team/${id}/workbook/list/`
    const token = localStorage.getItem("access")
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    axios.get(apiUrl, { headers: headers })
      .then(response => {
        const { data } = response
        setWorkbookList(data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  

  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#000',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#fff',
  };
  const { id } = useParams();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createWorkbook = () => {
    console.log(candiWB);
    let problems = []
    candiWB.map(wb => {
      problems.push(wb.id)
    })
    console.log(problems)
    const token = localStorage.getItem("access")
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    const apiUrl = `http://localhost:8000/api/team/${id}/workbook/create/`;
    axios.post(apiUrl, {name:name,problems:problems}, { headers: headers })
      .then(response => {
        const { data } = response;
        setWorkbookList(data)
      })
      .catch(error => {
        console.log(error)
      })
  };

  return (
    <div className='problem_all'>
      <div>
        <Button onClick={showModal}>
          문제집 추가
        </Button>
        <Modal title="문제집 생성" open={isModalOpen} onCancel={handleCancel}
        footer={[<Button key="submit" onClick={createWorkbook} type="primary">생성하기</Button>,]}>
          <Card>

          문제집 이름
          <div className='workbook_name' onChange={onChangeName} >
              <Input placeholder="문제집 이름" />
          </div>
          
          <div>
            추가할 문제집
            <div className='add_problem' onChange={onChangeProblem}>
            <Input size="small" placeholder="추가할 문제(백준 번호)" />
            </div>
            <Button onClick={addProblem}> 추가 </Button>
          </div>
          <Divider>문제 추가</Divider>
          {candiWB && candiWB.map(wb => {
            const {id,number,title,color,url} = wb
              return (
              <Tag color={color} closable onClose={(e)=>{closeTag({number},e)}}>{title}</Tag>
            );
          })}
          </Card>
        </Modal>
      </div>
      <Carousel afterChange={onChange}>
          
        {
          workbookList && workbookList.map(workbook => {
            console.log(workbookList)
            const dataSource = []
            return (
              <div style={contentStyle}>
                
                <h3>{workbook.title}</h3>
                <Divider>문제집 리스트</Divider>
                {workbook.problem_list && workbook.problem_list.map(data => {
                  let dataInfo = {title:data.problem.title, tier:data.problem.tier, number:data.problem.number}
                  dataSource.push(dataInfo)
                })}
                <Table dataSource={dataSource} columns={columns} pagination={false}/>;
              </div>
            );
          })
        }
      </Carousel>
    </div>

  );
}