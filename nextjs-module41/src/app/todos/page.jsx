

const TodoPage = async() => {

    const res = await fetch('https://jsonplaceholder.typicode.com/todos');
    const todos = await res.json();
    return (
        <div>
            <h1>length : {todos.length}</h1>
            
        </div>
    );
};

export default TodoPage;