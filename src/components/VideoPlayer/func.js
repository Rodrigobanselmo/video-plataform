export function isLocked(modules,aula,mI,cI) {
  if (aula==='lastModule') return 'lastModule'
  if (!aula?.lock) return 'ok'
  if (mI==0&&cI==0) return 'ok'

  if (aula?.lock && aula.lock.includes('order')) {
    // console.log(modules.position)
    // console.log(modules.position.split('/'))
    if (modules?.position) { //se ja assistiu
      const modPosition = modules.position.split('/')[0]
      const classPosition = modules.position.split('/')[1]
      if (parseInt(modPosition)<parseInt(mI)) return 'Assista os módulos anteriores para liberar o acesso a esse vídeo.'
      if (parseInt(modPosition)==parseInt(mI) && parseInt(classPosition)<parseInt(cI)) return 'Assista as aulas anteriores para liberar o acesso a esse vídeo.'
    } else if (!modules?.position) return 'Assista as aulas anteriores para liberar o acesso a esse vídeo.'
  }

  return 'ok'
}
