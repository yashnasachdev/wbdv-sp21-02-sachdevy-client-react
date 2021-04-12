import React, {useState, useEffect} from 'react'
import HeadingWidget from "./heading-widget";
import {connect} from "react-redux";
import ParagraphWidget from "./paragraph-widget";
import {useParams} from "react-router-dom";
import widgetService from '../../services/widgets-service'
import ImageWidget from "./image-widget"
import ListWidget from "./list-widget"


const WidgetList = () => {
    const {topicId} = useParams();
    const[widgets, setWidgets] = useState([])
    const [editingWidget, setEditingWidget] = useState({});
    useEffect(() => {
        if (topicId !== "undefined" && typeof topicId !== "undefined"){
            widgetService.findWidgetsForTopic(topicId).then(widgets => setWidgets(widgets))
        }

    }, [topicId])
   const createWidgetForTopic = () => {
            widgetService.createWidgetForTopic(topicId, {type: "HEADING", size: 1, text: "New Heading"})
                .then(actualWidget => {
                    setWidgets(widgets => ([...widgets, actualWidget]))
                })
        }

    const deleteWidget = (widget) => {
        widgetService.deleteWidget(widget.id).then(response => {
            setWidgets((widgets) => widgets.filter(w => w.id !== widget.id))
            setEditingWidget({})
        })}
    const updateWidget = (widget) =>{
        widgetService.updateWidget(widget.id, widget).then(response => {
            setWidgets((widgets) => widgets.map(w => w.id !== widget.id ? w : widget))
            setEditingWidget({})
        })}
        
    return(
        <div>
            <i onClick={createWidgetForTopic} title="Add Widget" className="fas fa-plus fa-2x float-right"></i>
            <h2>Widget List ({widgets.length}) {editingWidget.id}</h2>
            <ul className="list-group">
                {
                    widgets.map(widget =>
                    <li className="list-group-item" key={widget.id}>
                        {
                            editingWidget.id !== widget.id &&
                            <i onClick={() => setEditingWidget(widget)} title="Edit" className="fas fa-2x fa-cog float-right"></i>
                        }
                        {
                            widget.type === "HEADING" &&
                            <HeadingWidget
                                editing={editingWidget.id === widget.id}
                                widget={widget}
                                updateWidget={updateWidget}
                                deleteWidget={deleteWidget}/>
                        }
                        {
                            widget.type === "PARAGRAPH" &&
                            <ParagraphWidget
                                editing={editingWidget.id === widget.id}
                                widget={widget}
                                updateWidget={updateWidget}
                                deleteWidget={deleteWidget}/>
                        }
                        {
                            widget.type === "LIST" &&
                            <ListWidget
                                editing={editingWidget.id === widget.id}
                                widget={widget}
                                setWidget={setEditingWidget}
                                updateWidget={updateWidget}
                                deleteWidget={deleteWidget}/>
                        }
                        {
                            widget.type === "IMAGE" &&
                            <ImageWidget
                                editing={editingWidget.id === widget.id}
                                widget={widget}
                                setWidget={setEditingWidget}
                                updateWidget={updateWidget}
                                deleteWidget={deleteWidget}/>
                        }
                    </li>
                    )
                }
            </ul>

        </div>
    )
}

/*
const stpm = (state) => ({
    widgets: state.widgetReducer.widgets
})

const dtpm = (dispatch) => ({
    findWidgetsForTopic: (topicId) => {
       widgetService.findWidgetsForTopic(topicId)
           .then(widgets => dispatch({
               type: "FIND_WIDGETS_FOR_TOPIC",
               widgets
           }))
    },
    createHeadingForTopic: (topicId) =>{
       widgetService
           .createWidgetForTopic(topicId, {type: "HEADING", size: 1, text: "New Heading"})
           .then(actualWidget => (widgets => ([...widgets, actualWidget])))
           .then(widget => dispatch({
               type: "CREATE_WIDGET",
               widget
           }))
    },
    createParagraphForTopic: (topicId) =>{
           widgetService
               .createWidgetForTopic(topicId, {type: "PARAGRAPH", size: 1, text: "New Paragraph"})
               .then(actualWidget => (widgets => ([...widgets, actualWidget])))
               .then(widget => dispatch({
                   type: "CREATE_WIDGET",
                   widget
               }))
        },
    updateWidget: (widget) =>
            widgetService.updateWidget(widget._id, widget)
            .then(actualWidget => (widgets => ([...widgets, actualWidget])))
                .then(status => dispatch({
                    type:"UPDATE_WIDGET",
                    widget
                })),
    deleteWidget: (item)  =>
            widgetService.deleteWidget(item._id)
            .then(actualWidget => (widgets => ([...widgets, actualWidget])))
                .then(status => dispatch ({
                    type: "DELETE_WIDGET",
                    widgetToDelete: item
                }))

})

export default connect(stpm, dtpm)(WidgetList)*/
export default WidgetList
