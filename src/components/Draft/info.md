## Initialize Editor
useState(EditorState.createEmpty())

## Transform in Object to save
`API` = convertToRaw(editorState.getCurrentContent())

## Get from Object to use in Draft
  EditorState.createWithContent(
    convertFromRaw( `API` ),
  ),
