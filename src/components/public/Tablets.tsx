import { Chapter, dummyCh, Book, dummyB } from "../data/Chapter"
import { MetabookF, dummyMF } from "../data/Metabook"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "./../App.css"
import { instance } from "../AxiosInstance"
import Button from "@mui/material/Button"
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import BookView from "./BookView"
import Tags from "../Form/Tag/Tags"
import {Notes} from '../data/Note'
import {TagInUse} from '../data/Tag'

function Tablets() {
  const {ChId, LBId, RBId} = useParams()
  const [maxBookPage, setMaxBookPage] = useState<Number>(0)
  const [currentPage, setCurrentPage] = useState<Number>(1)
  const [leftChapter, setLeftChapter] = useState<Chapter>(dummyCh)
  const [rightChapter, setRightChapter] = useState<Chapter>(dummyCh)
  const [metabookF, setMetabookF] = useState<MetabookF>(dummyMF)
  const [tags, setTags] = useState<TagInUse[]>();
  const [isSplitView, onToggleSplitView] = useState(false)
  const [leftNotes, setLeftNotes] = useState<Notes>([])
  const [rightNotes, setRightNotes] = useState<Notes>([])
  const navigate = useNavigate()

  const headers = {headers: {'Origin': 'http://www.alefowl.com'}}

  useEffect(() => {
    getMetabookF()
    getChapters()
    updateChapters()
    if (ChId) {
      setCurrentPage(+ChId)
    }
  }, [ChId, LBId, RBId])

  useEffect(() => {getNotes()}, [LBId, RBId])
  useEffect(() => {
    const getSplitViewValue = localStorage.getItem('isSplitView')
    getSplitViewValue === 'true' ? handleChangeSplitView(true) : handleChangeSplitView(false)
  }, [localStorage.getItem('isSplitView')])

  function handleChangeSplitView(value = false) {
    onToggleSplitView(value)
    localStorage.setItem('isSplitView', JSON.stringify(value))
  }

  function getNotes() {
    instance.get<Notes>("/notes/" + Number(LBId), headers).then((n) => {setLeftNotes(n.data) })
    instance.get<Notes>("/notes/" + Number(RBId), headers).then((n) => {setRightNotes(n.data) })
  }

  function getMetabookF() {
    instance.get<MetabookF>("/metabookF/" + Number(LBId), headers)
      .then((response) => { 
        setMetabookF(response.data); 
        updateBookPage(response.data.metabook.size)
      })
  }

  function updateBookPage(bookSize: number) {
    if (!!bookSize) {
      setMaxBookPage(bookSize)
    } else {
      setMaxBookPage(0)
    }
  }

  function updateChapters() {
    const activeChapterTag = metabookF.tags.filter((el) => el.chapter.toString() === ChId)
    setTags(activeChapterTag)
  }

  function getChapters() {
    instance.get<Chapter>("/book/" + Number(LBId) + "/chapter/" + Number(ChId), headers).then((ch: any) => {
      setLeftChapter(ch.data) 
      if (maxBookPage === currentPage) return
      if (!ch.data.txt || ch.data.txt === "null") {
        navigate(`/lbid/${LBId}/rbid/${RBId}/chid/${Number(ChId) + 1}`)
      }
    })
    instance.get<Chapter>("/book/" + Number(RBId) + "/chapter/" + Number(ChId), headers).then((ch) => {setRightChapter(ch.data)})
  }

  function findBook(metabookF: MetabookF, bookId: number): Book {
    return metabookF.books.find((book) => book.id === bookId) ?? dummyB
  }
  const PageSwitchWrapper = () => {
    const isEmptyChapter = !leftChapter.txt || leftChapter.txt === "null"
    return (
        <Stack spacing={2} style={{margin: "30px 0"}}>
          <Pagination 
            page={+currentPage}
            count={Number(maxBookPage)}
            onChange={(e, page) => {
              if (isEmptyChapter) {
                if (page === +currentPage - 1) {
                  if ((+currentPage - 1) !== 0 || (+currentPage - 1) !== 1) {
                    setCurrentPage(page - 2)
                  } else if ((+currentPage - 1) !== 2) {
                    setCurrentPage(page - 1)
                  }
                }
                if (page === +currentPage + 1) {
                  setCurrentPage(page + 2)
                }
              } else {
                setCurrentPage(page)
              }
            }} 
            color="primary" 
            renderItem={(item) => {
              return <PaginationItem
                  component={Link}
                  to={`/lbid/${Number(LBId)}/rbid/${Number(RBId)}/chid/${item.page}`}
                  {...item}
                />
            }}
          />
        </Stack>
    )
  }
   return (
    <>
      <header className="App-header">
        <p>{findBook(metabookF, Number(LBId)).title}</p>
        <Button variant="contained" onClick={() => handleChangeSplitView(!isSplitView)}>Split View</Button>
        <Tags tags={tags}/>
      </header>
      <main className="App-main">
        {BookView(
          findBook(metabookF, Number(LBId)),
          findBook(metabookF, Number(RBId)),
          leftChapter,
          rightChapter,
          leftNotes,
          rightNotes,
          metabookF,
          Number(ChId),
          isSplitView
        )}
        <PageSwitchWrapper />
      </main>
    </>
  )
}
export default Tablets
