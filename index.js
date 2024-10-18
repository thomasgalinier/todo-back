const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;
app.use(cors());
app.use(bodyParser.json());

const TODO_FILE = path.join(__dirname, 'todos.json');

app.use(bodyParser.json());


app.get('/todos', (req, res) => {
    fs.readFile(TODO_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de lecture du fichier' });
        }
        res.json(JSON.parse(data));
    });
});


app.post('/todos', (req, res) => {
    const newTodo = req.body;

    fs.readFile(TODO_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de lecture du fichier' });
        }

        const todos = JSON.parse(data);
        todos.push(newTodo);

        fs.writeFile(TODO_FILE, JSON.stringify(todos, null, 2), 'utf8', (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            }
            res.status(201).json(newTodo);
        });
    });
});


app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);

    fs.readFile(TODO_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de lecture du fichier' });
        }

        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.id !== todoId);

        fs.writeFile(TODO_FILE, JSON.stringify(todos, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            }
            res.status(200).json({ message: 'Tâche supprimée avec succès' });
        });
    });
});
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const updatedTodo = req.body;

    fs.readFile(TODO_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de lecture du fichier' });
        }

        let todos = JSON.parse(data);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);

        if (todoIndex === -1) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };

        fs.writeFile(TODO_FILE, JSON.stringify(todos, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de l\'écriture dans le fichier' });
            }
            res.status(200).json(todos[todoIndex]);
        });
    });
});
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
