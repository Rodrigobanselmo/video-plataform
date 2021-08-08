import { useQuery } from "react-query";
import { useAuth } from "../../../context/AuthContext";
// import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { db } from "../../../lib/firebase.prod";

export async function getStudent(cursoId,currentUser) {
  const studentRef = db.collection('students').where('cursoId', '==', cursoId).where('uid', '==', currentUser.uid);
  const cursoRef = db.collection('curso').where('id', '==', cursoId);

  const cursos = await cursoRef.get();
  const students = await studentRef.get();
  const array = []

  students.forEach(doc=>{
    array.push(doc.data())
  })

  const responseStudent = [...array.sort((a, b) => - a.startDate + b.startDate)]

  let responseCurso = {}

  cursos.forEach(doc=>{
    if (!doc.data()?.editorState) {
      const cursoData = {...doc.data()}
      cursoData.modules = cursoData.modules.map(module => {
        const newModuleClasses = module.classes.map(classItem => {

          function isEpiAvailable(epiId) {
            if (!responseStudent[0]) return false
            if (!responseStudent[0]?.classes) return false
            if (!Array.isArray(responseStudent[0].classes)) return false //se nao epis nao esta no formato de array
            if (responseStudent[0].classes.includes(epiId)) return true //rocura por id do epi se nao acha retorna false
            return false
          }

          if (!classItem?.epi || isEpiAvailable(classItem.id)) return classItem
        }).filter(i=>i)
        console.log('newModuleClasses',newModuleClasses)
        return {...module,classes:newModuleClasses}
      }).filter(i=>i)
      console.log('cursoData',cursoData)

      responseCurso = cursoData
    }
  })

  console.log('refresh curso')

  // return [...array]

  return {student:responseStudent,curso:responseCurso}
}

export function useStudent({cursoId}) {
  // const { setLoaderDash } = useLoaderDashboard();
  const {currentUser} = useAuth()

  return useQuery(['student',cursoId, currentUser.uid], ()=>getStudent(cursoId,currentUser), {
    staleTime: 1000 * 60 * 60 * 24,
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))
