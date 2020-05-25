import datetime
from flask import Flask, render_template, request
app = Flask(__name__)
import math
import json

TASK_FILE = 'tasks.txt'
DEADLINE = datetime.datetime(2020, 12, 31)
HOURS_PER_DAY = 5

class MyTime:
    def __init__(self, frac_hour):
        self.frac_hour = frac_hour
        self.hour = math.floor(frac_hour)
        self.minute = math.floor((self.frac_hour - self.hour) * 60)

    def __str__(self):
        return '{}h {}m'.format(self.hour, self.minute)

class Task:
    id_counter = 0
    def __init__(self, name, notes, time, date):
        Task.id_counter +=1
        self.name = name
        self.notes = notes
        self.time = MyTime(time)
        self.task_id = Task.id_counter
        self.date = date
    
    # @property
    # def datestring(self):
    #     return 

    @classmethod
    def from_string(cls, task_str, month, year):
        day, name, notes, time = task_str.split(' - ')
        return cls(name, notes, float(time), 
        datetime.datetime(year, month, int(day))) 


def read_tasks(task_file):
    tasks = []
    with open(task_file) as f:
        task_rows = f.readlines()

    for row in task_rows:
        if len(row) > 0:
            if row.startswith('**'):
                _, month, year, _ = row.split(' ')
                month = datetime.datetime.strptime(month, '%B').month
                year = int(year)
            else:
                tasks.append(Task.from_string(row, month, year))
    return tasks

def task_handler(name=None):
    tasks = read_tasks(TASK_FILE)
    tasks = list(reversed(tasks))
    if name is not None:
        tasks = [t for t in tasks if t.name==name]
    names = sorted(set([t.name for t in tasks]))
    done = MyTime(sum([t.time.frac_hour for t in tasks]))
    diff = (DEADLINE - datetime.datetime.now())
    days = (diff.days) + (diff.seconds / 3600) / 24
    left = MyTime(days * HOURS_PER_DAY)
    deadline = DEADLINE.strftime('%d.%m.%Y')
    return render_template('index.html', tasks=tasks, 
    names=list(enumerate(names)), done=done, left=left, deadline=deadline)

@app.route('/')
def index():
    return task_handler()

@app.route('/<tag>')
def tag_page(tag):
    return task_handler(tag)

    