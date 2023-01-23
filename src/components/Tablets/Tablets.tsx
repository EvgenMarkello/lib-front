import { Chapter, dummyCh, Book, dummyB } from "./../data/Chapter"
import { MetabookF, dummyMF } from "./../data/Metabook"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./../App.css"
import { instance } from "./../AxiosInstance"
import Button from "@mui/material/Button"
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import BookView from "./BookView"
import Tags from "../Form/Tag/Tags"
import {TagsT} from './../data/Tag'
import {Note, Notes} from './../data/Note'

const dummData = [
    {book: 2, chapter: 2, owners_description: '', owners_title: 'sex'},
    {book: 2, chapter: 2, owners_description: '', owners_title: 'comedy'},
    {book: 2, chapter: 3, owners_description: '', owners_title: 'war'},
    {book: 2, chapter: 4, owners_description: '', owners_title: 'detective'},
    {book: 2, chapter: 4, owners_description: '', owners_title: 'drama'},
    {book: 2, chapter: 5, owners_description: '', owners_title: 'comedy'},
]

function Tablets() {
  const {ChId, LBId, RBId} = useParams()
  const [maxBookPage, setMaxBookPage] = useState<Number>(0)
  const [currentPage, setCurrentPage] = useState<Number>(1)
  const [leftChapter, setLeftChapter] = useState<Chapter>(dummyCh)
  const [rightChapter, setRightChapter] = useState<Chapter>(dummyCh)
  const [metabookF, setMetabookF] = useState<MetabookF>(dummyMF)
  const [tags, setTags] = useState<TagsT>();
  const [isSplitView, onToggleSplitView] = useState(false)
  const [leftNotes, setLeftNotes] = useState<Notes>([])
  const [rightNotes, setRightNotes] = useState<Notes>([])

  useEffect(() => {
    getMetabookF()
    getChapters()
    updateChapters()
    setCurrentPage(Number(ChId))
  }, [ChId, LBId, RBId])

  useEffect(() => {getNotes()}, [LBId, RBId])

  function getNotes() {
    instance.get<Notes>("/notes/" + Number(LBId)).then((n) => {setLeftNotes(n.data) })
    instance.get<Notes>("/notes/" + Number(RBId)).then((n) => {setRightNotes(n.data) })
  }

  function getMetabookF() {
    instance.get<MetabookF>("/metabookF/" + Number(LBId))
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
    const activeChapterTag = dummData.filter((el) => el.chapter.toString() === ChId)
    setTags(activeChapterTag)
  }

  function getChapters() {
    instance.get<Chapter>("/book/" + Number(LBId) + "/chapter/" + Number(ChId)).then((ch) => {setLeftChapter(ch.data) })
    instance.get<Chapter>("/book/" + Number(RBId) + "/chapter/" + Number(ChId)).then((ch) => {setRightChapter(ch.data)})
  }

  function findBook(metabookF: MetabookF, bookId: number): Book {
    const book: Book =
      metabookF.books.find((book) => book.id === bookId) ?? dummyB
    return book
  }
  const PageSwitchWrapper = () => {
    return (
        <Stack spacing={2}>
          <Pagination 
            page={+currentPage}
            count={(Number(maxBookPage) - 1)} 
            color="primary" 
            renderItem={(item) => {
              console.log(item)
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
        <Button variant="contained" onClick={() => onToggleSplitView(!isSplitView)}>Split View</Button>
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
