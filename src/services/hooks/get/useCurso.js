import { useQuery } from "react-query";
// import { useLoaderDashboard } from "../../../context/LoadDashContext";
import { db } from "../../../lib/firebase.prod";

export async function getCurso(cursoId) {
  const reduceRef = db.collection('curso').where('id', '==', cursoId);

  const cursos = await reduceRef.get();
  let array = []

  cursos.forEach(doc=>{
    const data = doc.data()
    if (data?.editorState) array[1] = doc.data()
    else array[0] = doc.data()
  })

  return [...array]
}

export function useCurso({cursoId}) {
  // const { setLoaderDash } = useLoaderDashboard();

  return useQuery(['curso',cursoId], ()=>getCurso(cursoId), {
    staleTime: 1000 * 60 * 60 * 24,
  })
}

// await queryClient.prefetchQuery(['user', userId], async () => {
//   ....
// })

//const mutation = useMutation(newTodo => axios.post('/todos', ()=>{})))


// export async function getCurso(cursoId,currentUser) {
//   const reduceRef = db.collection('curso').where('id', '==', cursoId);

//   const cursos = await reduceRef.get();
//   let array = []

//   cursos.forEach(doc=>{
//     const data = doc.data()
//     if (data?.editorState) array[1] = doc.data()
//     else {
//       const cursoData = {...doc.data()}
//       cursoData.modules = cursoData.modules.map(module => {
//         const newModuleClasses = module.classes.map(classItem => {

//           function isEpiAvailable(epiId) {
//             if (!currentUser.cursos) return false //se nao existe cursos
//             const cursoUserIndex = currentUser.cursos.findIndex(i=>i.id === cursoId);
//             if (cursoUserIndex === -1) return false //se nao existe o id do curso
//             if (!currentUser.cursos[cursoUserIndex]?.epi) return false //se nao existe o epis dentro do curso
//             if (!Array.isArray(currentUser.cursos[cursoUserIndex].epi)) return false //se nao epis nao esta no formato de array
//             const epiIndex = currentUser.cursos[cursoUserIndex].epi.findIndex(i=>i.id === epiId)
//             if (epiIndex === -1) return false //rocura por id do epi se nao acha retorna false
//             return true
//           }

//           if (!classItem?.epi || isEpiAvailable(classItem.id)) return classItem
//         }).filter(i=>i)
//         console.log('newModuleClasses',newModuleClasses)
//         return {...module,classes:newModuleClasses}
//       }).filter(i=>i)
//       console.log('cursoData',cursoData)
//       array[0] = {...doc.data()}
//     }
//   })

//   console.log('refresh curso')

//   return [...array]
// }
