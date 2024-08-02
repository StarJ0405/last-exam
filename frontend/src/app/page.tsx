'use client';

import { useEffect, useRef, useState } from 'react';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});
const getWeather = async () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  const base_date = date.getFullYear() + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + (date.getDate() < 9 ? '0' : '') + date.getDate();
  const base_time = (date.getHours() < 9 ? '0' : '') + date.getHours() + (date.getMinutes() < 9 ? '0' : '') + (date.getMinutes() - date.getMinutes() % 10);

  const response = await axios.get(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=DEDxtLSKv9FP%2B2Th6HjclgFezo37jAJ0hTteg6OJNCKuWAfX7IXJ6YbEV2U23AOJ33%2BrnXl7gvgAST0eUn%2FKzw%3D%3D&base_date=${base_date}&base_time=${base_time}&nx=55&ny=127&dataType=JSON`)
  return response.data;
}
const createArticle = async (data: Article) => {
  const response = await api.post('/api/article', data);
  return response.data;
}
const readArticle = async (page: number) => {
  const response = await api.get('/api/article', { headers: { Page: page } });
  return response.data;
}
const updateArticle = async (data: Article) => {
  const response = await api.put('/api/article', data);
  return response.data;
}
const deleteArticle = async (id: number) => {
  const response = await api.delete('/api/article', { headers: { Id: id } });
  return response.data;
}
interface Article {
  id?: number;
  title: string,
  content: string
}
export default function Home() {
  const [page, setPageState] = useState(0);
  const pageRef = useRef(page);
  const maxPageRef = useRef(0);
  const [status, setStatusState] = useState(0);
  const statusRef = useRef(status);
  const [articles, setArticlesState] = useState<Article[]>([]);
  const articlesRef = useRef(articles);
  const [id, setId] = useState(-1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [weather, setWeahter] = useState(0);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getWeather().then(r => {
      if (r.response?.body?.items?.item)
        for (let item of r.response.body.items.item) {
          if (item.category == 'T1H') {
            setWeahter(Number(item.obsrValue));
            break;
          }
        }
    }).catch(e => console.log(e));
    readArticle(page).then(r => setArticles(r)).catch(e => console.log(e));
  }, [])
  useEffect(() => {
    const handler = () => {
      const page = pageRef.current;
      if (statusRef.current == 0 && page < maxPageRef.current && !isLoading && window.scrollY == document.body.clientHeight - window.innerHeight) {
        const newPage = page + 1;
        readArticle(newPage).then(r => setArticles(r)).catch(e => console.log(e));
        setPage(newPage);
        setLoading(true);
        const interval = setInterval(() => { setLoading(false); clearInterval(interval) }, 300);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      if (date.getMinutes()%10 == 0 && date.getSeconds() == 0)
        getWeather().then(r => {
          if (r.response?.body?.items?.item)
            for (let item of r.response.body.items.item) {
              if (item.category == 'T1H') {
                setWeahter(Number(item.obsrValue));
                break;
              }
            }
        }).catch(e => console.log(e));
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  function setPage(page: number) {
    pageRef.current = page;
    setPageState(pageRef.current);
  }
  function setArticles(r: any) {
    articlesRef.current = [...articlesRef.current, ...r.content];
    setArticlesState(articlesRef.current);
    maxPageRef.current = r.totalPages;
  }
  function setStatus(change: number) {
    // 1 -> 1 : 거부
    if (status == 1 && change == 1)
      return;
    statusRef.current = change;
    // ? -> 0 : 데이터 로딩
    switch (change) {
      case 0: {
        setPage(0);
        readArticle(0).then(r => { articlesRef.current = r.content; setArticlesState(articlesRef.current); maxPageRef.current = r.totalPages; }).catch(e => console.log(e));
        break;
      }

    }
    // 1 -> ? : 작성 데이터 초기화
    switch (status) {
      case 1: {
        setTitle('');
        setContent('');
        setId(-1);
        break;

      }
    }
    setStatusState(change);
  }

  return (
    <main className='flex w-full h-full flex-col items-center justify-center p-24'>
      <div className='border-b-2 p-4 flex w-[70%] PC:justify-between Mobile:flex-col items-center'>
        <label className='cursor-pointer' onClick={() => setStatus(0)}>Logo</label>
        <label>현재기온 : {weather}도</label>
        <div>
          <button className={'hover:text-red-500 mr-2' + (id > 0 ? ' hidden' : '')} onClick={() => setStatus(1)}>글 작성</button>
          <button className='hover:text-red-500 mr-2'>Login</button>
          <button className='hover:text-red-500 mr-2'>Singup</button>
        </div>
      </div>
      <div className={'p-4 flex flex-wrap PC:w-[704px] Mobile:w-[220px]' + (status == 0 ? '' : ' hidden')}>
        {articles.map((article, index) => <div className='cursor-pointer m-3 group w-[200px] h-[300px] bg-gray-200 hover:bg-gray-500 flex flex-col items-center justify-center' key={index} onClick={() => { setTitle(article.title); setContent(article.content); setStatus(1); setId(article.id as number); }}>
          <label className='group-hover:text-white'>{article.title ? article.title : '빈 제목'}</label>
        </div>)}
      </div>
      {status == 1 ?
        <div className='flex flex-col w-[50%]' >
          <label>제목</label>
          <input className='input input-bordered my-2' defaultValue={title} type="text" onChange={e => setTitle(e.target.value)} />
          <label>내용</label>
          <textarea className='input input-bordered my-2 h-[200px] resize-none' defaultValue={content} onChange={e => setContent(e.target.value)}></textarea>
          <div className='self-end'>
            {id > 0 ?
              <>
                <button className='mr-2 hover:text-red-500' onClick={() => updateArticle({ id: id, title: title, content: content }).then(() => setStatus(0)).catch(e => console.log(e))}>수정</button>
                <button className='mr-2 hover:text-red-500' onClick={() => deleteArticle(id).then(() => setStatus(0)).catch(e => console.log(e))}>삭제</button>
              </>
              :
              <button className='mr-2 hover:text-red-500' onClick={() => { createArticle({ title: title, content: content }).then(() => setStatus(0)).catch(e => console.log(e)); setStatus(0) }}>등록</button>}
            <button className='mr-2 hover:text-red-500' onClick={() => setStatus(0)}>취소</button>
          </div>
        </div>
        : <></>}
    </main>
  );
}
