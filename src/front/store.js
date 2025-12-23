export const initialStore=()=>{
  return{
    message: null,
    current_user:{},
    people_list: [],
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    
    case "current_user":
      const data = action.payload

      return{
        ...store, current_user:data
      }
    
    case "save_people_list":
      return {
        ...store,
        people_list: action.payload
      };
    
     case "data_people":
      return { ...store, data_people: action.payload };

    default:
      throw Error('Unknown action.');
  }    
}
