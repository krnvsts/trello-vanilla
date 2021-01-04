const Application = {
    save() {
        // Сохраняем в LS все данные
        const object = {
            columns: {
                // title:
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        }
        document.querySelectorAll('.column')
            .forEach(columnElement => {
                const column = {
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    nodeIds: []
                }

                columnElement
                    .querySelectorAll('.note')
                    .forEach(noteElement => {
                        column.nodeIds.push(parseInt(noteElement.getAttribute('data-note-id')))
                    })

                object.columns.items.push(column)
            })

        document
            .querySelectorAll('.note')
            .forEach(noteElement => {
                const note = {
                    id: parseInt(noteElement.getAttribute('data-note-id')),
                    content: noteElement.textContent
                }
                object.notes.items.push(note)
            })

        const json = JSON.stringify(object)

        localStorage.setItem('trello', json)
    },
    load() {
        // Загружаем данные из LS
        if(!localStorage.getItem('trello')) {
            return
        }
        const mountPoint = document.querySelector('.columns')
        mountPoint.innerHTML = ''

        const object = JSON.parse(localStorage.getItem('trello'))
        const getNoteById = id => object.notes.items.find(note => note.id === id)

        for(const column of object.columns.items) {
            const columnElement = Column.create(column.id)
            mountPoint.append(columnElement)

            for (const noteId of column.nodeIds) {
                const { id, content } = getNoteById(noteId)

                const note = new Note(id, content)
                columnElement.querySelector('[data-notes]').append(note.element)
            }
        }
    }
}