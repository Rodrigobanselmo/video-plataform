/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// @ts-ignore
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
// import Modal from './Modal'
import styled, {css} from 'styled-components';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import HelpIcon from '@material-ui/icons/Help';
import { InputEnd } from '../../Main/MuiHelpers/Input';
import { NumberHours, NumberDays } from '../../../lib/textMask';
import { useDispatch } from 'react-redux';
import { ButtonForm } from '../../Dashboard/Components/Form/comp';
import writeXlsxFile from 'write-excel-file'
import readXlsxFile from 'read-excel-file'
import { v4 } from 'uuid';
import { useNotification } from '../../../context/NotificationContext';

const ModuleView = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  margin: 10px 0 20px 0;
  padding: 10px;
  box-shadow: 1px 1px 3px 1px rgba(0,0,0,0.23);

  > p {
    font-size:1.1rem;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 0 10px 0;
    > span {
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:1.1rem;
    }
  }
`;

const ClassesView = styled.div`
  background-color: ${({ theme }) => (theme.palette.background.line)};
  border-radius: 8px;
  margin: 0 0 10px 0;
  padding: 10px;

  > p:nth-child(1) {
    font-size:1rem;
    font-weight: bold;
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    > span {
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:1rem;
    }
  }

  > p:nth-child(2) {
    font-size:0.92rem;
    margin: 0 0 2px 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    > a {
      text-decoration: underline;
      color: ${({ theme }) => theme.palette.text.primary};
      font-size:0.92rem;
      &:hover {
        opacity:0.7;
      }
    }

  }

  > p:nth-child(3) {
    font-size:0.92rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    > span {
      font-size:0.82rem;
      color: ${({ theme }) => theme.palette.primary.contrastText};
      background-color: ${({ theme,epi }) => epi?(theme.palette.status.success):(theme.palette.status.infoD)};
      font-weight: bold;
      padding: 1px 5px;
      border-radius: 4px;
      &.green {
        background-color: ${({ theme }) => theme.palette.status.orange};
      }
    }
  }

`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
`;

const Input = styled.input`
  margin-right: auto;
  padding: 20px;
  border: 2px dashed ${({ theme }) => theme.palette.background.line};
  border-radius: 10px;
`;

export const ModuleData = ({modules = {}, setModules, setCombos, combos, subCursos, setSubCursos}) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const notification = useNotification();
  // const [data, setData] = useState(modules)

  // useEffect(() => {
    // setData(modules)
  // }, [modules])

  // const data = modules;

  const onChangeModule = (module) => {
    setModules(module)
  }

  const onExcelTestJson = (dataClass) => {
    if (!dataClass?.questions) return null
    return dataClass.questions?.map((question, index) => {
      console.log('question',question)
      const data = {
        text:question?.text,
        answer:question?.answer,
        why:question?.why,
        index: index + 1,
        type: 'Avaliação',
      }

      const options = ['a','b','c','d','e'].map((i,indx)=>{
        data[i] = question?.options[indx] ? question?.options[indx].text : '';
        return 0
      })

      // data.id = ''
      // data.name = ''
      // data.maxTime = ''

      const percentage = dataClass?.percentageToPass && (
        typeof dataClass?.percentageToPass === 'number'
          ? `${dataClass.percentageToPass*100}%`
          : dataClass?.percentageToPass.includes('%')
            ? dataClass.percentageToPass
            : `${Number(dataClass.percentageToPass*100)}%`
        )

      if (index === 0) {
        data.percentageToPass = percentage
        data.id = dataClass?.id
        data.classId = dataClass?.id
        data.name = dataClass?.name
        data.className = dataClass?.name
        data.maxTime = dataClass?.maxTime
        data.subName = subCursos.length > 0 ? subCursos.find(i=>i.id.includes(dataClass.id)) ? subCursos.find(i=>i.id.includes(dataClass.id)).name : '' : ''
        data.epi = dataClass?.epi ? 'SIM' : 'NÃO'
      }
      return data
    })
  }

  const handleDownloadFile = async () => {

    const modulesClassesArray = [];
    const modulesTestArray = [];
    modules.map((module, index)=>{
      module.classes.map((cls,indexCLS)=>{

        if (cls?.type === 'test') {
          const testData = onExcelTestJson(cls)
          if (!testData) return
          modulesTestArray.push(testData)
          console.log('testData[0]',testData)
          return modulesClassesArray.push({...testData[0],moduleId:module.id,})
        }

        console.log('subCursos',subCursos)

        const data = {
          moduleName:indexCLS===0?module.name:'',
          moduleIndex:indexCLS===0?index+1:'',
          className:cls.name,
          video:cls?.video ?? '',
          epi:cls?.epi ? 'SIM' : 'NÃO',
          moduleId:module.id,
          classId:cls.id,
          subName:subCursos.length > 0 ? subCursos.find(i=>i.id.includes(cls.id)) ? subCursos.find(i=>i.id.includes(cls.id)).name : '' : '',
          // type:cls?.questions?'teste':'video',
        }
        modulesClassesArray.push(data)
      })
    })

    const schemaTest = [
      {
        column: 'ID',
        type: String,
        width: 40,
        value: data => data?.id
      },
      {
        column: 'Nome do teste',
        type: String,
        width: 20,
        value: data => data?.name
      },
      {
        column: 'Tempo máximo em minutos',
        type: Number,
        width: 30,
        value: data => data?.maxTime
      },
      {
        column: 'Porcentagem de acertos para passar',
        type: String,
        width: 40,
        value: data => data?.percentageToPass
      },
      {
        column: 'Questões',
        type: Number,
        width: 20,
        value: data => data?.index
      },
      {
        column: 'texto',
        type: String,
        width: 20,
        value: data => data?.text
      },
      {
        column: 'a',
        type: String,
        value: data => data?.a
      },
      {
        column: 'b',
        type: String,
        value: data => data?.b
      },
      {
        column: 'c',
        type: String,
        value: data => data?.c
      },
      {
        column: 'd',
        type: String,
        value: data => data?.d
      },
      {
        column: 'e',
        type: String,
        value: data => data?.e
      },
      {
        column: 'resposta',
        type: String,
        width: 20,
        value: data => data?.answer
      },
      {
        column: 'explicação',
        type: String,
        width: 20,
        value: data => data?.why
      },
    ]

    const schemaData = [
      {
        column: 'Nome do Modulo',
        type: String,
        width: 20,
        value: data => data.moduleName
      },
      {
        column: 'Número do Modulo',
        type: Number,
        width: 20,
        value: data => data.moduleIndex
      },
      {
        column: 'Tipo',
        type: String,
        value: data => data?.type?data?.type:'Aula',
        fontWeight: 'bold',
        width: 20
      },
      {
        column: 'Nome da Aula / Teste',
        type: String,
        value: data => data.className,
        width: 20,
      },
      {
        column: 'URL do Vídeo',
        type: String,
        width: 20,
        value: data => data.video
      },
      {
        column: 'Vendido Separadamente',
        type: String,
        width: 28,
        value: data => data.epi
      },
      {
        column: 'Nome do pacote caso for vendido separadamente',
        type: String,
        width: 45,
        value: data => data.subName
      },
      {
        column: 'ID do Módulo',
        type: String,
        width: 30,
        value: data => data.moduleId
      },
      {
        column: 'ID da Aula',
        type: String,
        width: 30,
        value: data => data.classId
      },
    ]

    const schemaCombos = [
      {
        column: 'Quantidade de EPIs',
        type: Number,
        width: 20,
        value: data => data.quantity
      },
      {
        column: 'Preço total da comprar',
        type: Number,
        width: 20,
        value: data => data.price
      },
    ]

    const schema = [
      schemaData, ...modulesTestArray.map(()=>schemaTest), schemaCombos
    ]

    const sheets = ['Sheet 1', ...modulesTestArray.map((i, idx)=>('teste ' + idx + ' - ' + i[0].text.substr(0,10))),'combos']

    console.log('schema',schema)
    console.log('sheets',sheets)
    console.log('modulesClassesArray',modulesClassesArray)
    console.log('modulesTestArray',modulesTestArray)
    console.log('combos',combos)

    await writeXlsxFile([modulesClassesArray,...modulesTestArray, combos], {
      schema,
      sheets,
      fileName: 'modulos.xlsx'
    })
  }

  const resolveExcelFile = async (file,sheet) => {
    const schema = {
      'About': {
        prop: 'module',
        type: {
          'ID': {
            prop: 'id',
            type: String,
          },
          'Nome do teste': {
            prop: 'name',
            type: String,
          },
          'Tempo máximo em minutos': {
            prop: 'maxTime',
            type: Number,
          },
          'Porcentagem de acertos para passar': {
            prop: 'percentageToPass',
            type: String,
          },
        },
      },
      'QUESTIONS': {
        prop: 'question',
        type: {
          'texto': {
            prop: 'text',
            type: String,
            required: true,
          },
          'resposta': {
            prop: 'answer',
            type: String,
            required: true,
          },
          'explicação': {
            prop: 'why',
            type: String,
          },
          'options': {
            prop: 'options',
            type: {
              'a': {
                prop: 'a',
                type: String,
                required: true,
              },
              'b': {
                prop: 'b',
                type: String,
                required: true,
              },
              'c': {
                prop: 'c',
                type: String,
              },
              'd': {
                prop: 'd',
                type: String,
              },
              'e': {
                prop: 'e',
                type: String,
              },
            },
          },
        },
      },
    }

    const { rows, errors } = await readXlsxFile(file, {schema,sheet})
    if (ref.current) ref.current.value = '';
    console.log(errors,'errors')
    const mdData = rows.find((i)=>i?.module)

    if (!mdData) throw 'Seu arquivo excel encontra-se com paginas com formatação fora do esperado'
    const moduleData = mdData.module

    const questionsData = rows.map((i)=>{
      return {
        text:i.question.text,
        answer:i.question.options[i.question.answer] || Object.values(i.question.options).find(fi=>i.question?.answer && fi === i.question.answer),
        why:i.question?.why ? i.question?.why : '' ,
        id:v4(),
        options:Object.values(i.question.options).map((text)=>({text})).filter((t)=>t.text)
      }
    })

    const percentage = moduleData?.percentageToPass && (
      typeof moduleData?.percentageToPass === 'number'
        ? moduleData.percentageToPass
        : Number(moduleData.percentageToPass.replace('%',''))/100
      )

    return {
      ...moduleData,
      id: moduleData.id,
      // id: moduleData.id.includes('-test') ? moduleData.id : `${v4()}-test`,
      private: true,
      lock: ['order'],
      questions:questionsData,
      numQuestions:questionsData.length,
      numToPass: Math.ceil(percentage*questionsData.length),
      type:'test'
    }
  };

  const onInputFileChange = async (e) => {
    console.log(e.target.files);

    const schema = {
      'Nome do Modulo': {
        prop: 'nameM',
        type: String,
      },
      'Número do Modulo': {
        prop: 'indexM',
        type: Number,
      },
      'Tipo': {
        prop: 'type',
        type: String,
      },
      'Nome da Aula / Teste': {
        prop: 'name',
        type: String,
      },
      'URL do Vídeo': {
        prop: 'video',
        type: String,
      },
      'Vendido Separadamente': {
        prop: 'epi',
        type: String,
      },
      'Nome do pacote caso for vendido separadamente': {
        prop: 'subGroup',
        type: String,
      },
      'ID do Módulo': {
        prop: 'idM',
        type: String,
      },
      'ID da Aula': {
        prop: 'id',
        type: String,
      }
    }


    const schemaCombos = {
      'Quantidade de EPIs': {
        prop: 'quantity',
        type: Number,
      },
      'Preço total da comprar': {
        prop: 'price',
        type: Number,
      },
    }

    try {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const sheets = await readXlsxFile(e.target.files[0], { getSheets: true })

        const { rows, errors } = await readXlsxFile(file, {schema})

        const testFiles = [];
        if (sheets.length > 1) {
          await Promise.all(sheets.map( async (i,idx)=>{
            if (i.name === 'combos') {
              const { rows:combs, errors } = await readXlsxFile(file, {schema:schemaCombos,sheet:'combos'})
              setCombos(combs)
              return null
            }
            if (idx === 0) return null
            const test = await resolveExcelFile(file,i.name);
            testFiles.push(test)
          }))
        }

        const modules = [];
        rows.map((i) => {
          if (i.indexM) modules[i.indexM-1] = {
            name:i.nameM,
            id:i.idM,
            classes:[]
          }
        })

        const subs = [];
        rows.map((i) => {
          const index = modules.findIndex(item=>item.id === i.idM)

          if (index === -1) throw 'Id de modulo inválido'
          const indexTest = testFiles.findIndex(item=>item.id === i.id)

          const epi = i?.epi && i.epi === 'SIM' ? true : false;

          if (epi) {
            console.log(i,i?.subGroup)
            if (!i?.subGroup) throw 'O campo "Nome do pacote caso for vendido separadamente" não pode ser nulo para resposatas "SIM"'
            if (subs.some(sub=>sub.name === i.subGroup)) {
              const indexSub = subs.findIndex(sub=>sub.name === i.subGroup)
              subs[indexSub].id = subs[indexSub].id + '//' + i.id
            } else {
              subs.push({
                name:i.subGroup,
                id:i.id
              })
            }
          }

          if (indexTest !== -1) {
            modules[index].classes.push({
              ...testFiles[indexTest],
              epi
            })
          } else {

            const addClass = {
              id:i.id,
              lock:['order'],
              name:i.name,
              private:true,
              epi,
              video: i?.video ? i.video : ''
            }
            modules[index].classes.push(addClass)
          }

        })

        console.log('testFiles',testFiles)
        console.log('subs',subs)
        setSubCursos(subs)
        onChangeModule(modules)
        if (ref.current) ref.current.value = '';
      }
    } catch (error) {
      if (typeof error !== 'string') return console.log('error', error);
      switch (error) {
        case 'wrong_path':
          // notification.modal({
          //   title: 'Error ao importar arquivos',
          //   text:
          //     'A estrutura de pastas encontra-se diferente do que é esperado, reveja as orientção para se inserir um novo curso. Pasta > Módulos > (arquivos de videos e teste)',
          //   rightBnt: 'Sair',
          //   open: true,
          // });
          break;

        default:
          notification.error({message:error})
          break;
      }
      if (ref.current) ref.current.value = '';
      console.log('error', error);
    }
  };

  return (
      <>
        {modules.map((module,index)=>{
          return (
            <ModuleView key={module.id}>
              <p>Módulo {index+1}: <span>{module.name}</span></p>
              {module.classes.map((cls,index)=>{
                  const percentage = cls?.percentageToPass && (
                    typeof cls?.percentageToPass === 'number'
                      ? `${cls.percentageToPass*100}%`
                      : cls?.percentageToPass.includes('%')
                        ? cls.percentageToPass
                        : `${Number(cls.percentageToPass*100)}%`
                    )



                return (
                  <ClassesView epi={cls?.epi} key={cls.id}>
                    {cls?.type == 'test'?
                      <>
                        <p>Teste {index+1}: <span>{cls.name}</span></p>
                        <p>Número de questões: <span>{cls.numQuestions}</span></p>
                        <p>Porcentagem para passar: <span className='green'>{percentage}</span></p>
                      </>
                    : (
                      <>
                        <p>Aula {index+1}: <span>{cls.name}</span></p>
                        <p>Video URL: <a target="_blank" href={cls.video}>{cls.video}</a></p>
                        <p>Vendido separadamente: <span>{cls?.epi ? 'SIM':"NÃO"}</span></p>
                      </>
                    )}
                  </ClassesView>
                )
              })}
            </ModuleView>
          )
        })}
        <ButtonsContainer>
          <ButtonForm
            style={{ marginBottom: '10px', minWidth: 100 }}
            primary
            type="button"
            loading={false}
            onClick={handleDownloadFile}
          >
            Download
          </ButtonForm>
          <Input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={onInputFileChange}
            type="file"
            ref={ref}
          />
        </ButtonsContainer>
      </>
  );
};

