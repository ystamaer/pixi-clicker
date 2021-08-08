import * as PIXI from 'pixi.js';

// Алиасы
let Application     = PIXI.Application,
    Container       = PIXI.Container,
    loader          = PIXI.Loader.shared,
    resources       = PIXI.Loader.shared.resources,
    Graphics        = PIXI.Graphics,
    TextureCache    = PIXI.utils.TextureCache,
    Sprite          = PIXI.Sprite,
    Text            = PIXI.Text,
    TextStyle       = PIXI.TextStyle;

// создание самого приложения
const app = new PIXI.Application({
    width: 512,
    height: 512,
    antialias: true,// добавление сглаживания
});

// вставляем канвас, созданый в приложении, на страницу
document.body.appendChild(app.view);

/*
state - статус игры
scoreBar -контейнер для очков
value = 0 - значение для очков
score - фон для очков
target - наше печенько
gameScene - игровая сцена
id - для способов загрузки из кеша
bg - фон самой игры
timer = 10 - таймер для ограничения по кликам
targetClick = true - разрешение на клик
* */
let state, scoreBar,value = 0, score, target, gameScene,
    id, bg, timer = 10, targetClick = true;

loader
    // Загрузка нужного изображения
    .add("assets/atlas.json")
    // Вызов load позволяет обработать или вызвать что-то еще, после загрузки изображения
    .load(setup);

// Тут разбирается atlas на нужные картинки и изображения
function setup() {
    // Доступ к atlas
    id = resources["assets/atlas.json"].textures;

    // Создаем контейнер и записываем его в игровую сцену
    gameScene = new Container();
    // Добавление сцены в основное приложение
    app.stage.addChild(gameScene);

// Фон для игры
    // создание спрайта с использованием алиаса id
    bg = new Sprite(id["background.png"]);
    // Изменяем якорь у картинки
    bg.anchor.set(0, 0);
    // Добавление картинки с фоном в игровую сцену
    gameScene.addChild(bg);

// КОнтейнер для очков
    let scoreBar = new Container();
    // выравнивание контейнера по горизонту
    scoreBar.position.set(app.stage.width / 2 - scoreBar.width / 2, 22);
    // Добавление в игровую сцену
    gameScene.addChild(scoreBar);

// Фон для контейнера с очками
    let bgscoreBar = new Sprite( id["score.png"] );
    scoreBar.addChild( bgscoreBar );

// Создаем стиля для текста контейнера очков
    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 28,
        fill: "white",
    });

// Создаем очки
    score = new Text("0", style);
    // выравниваем очки по кординатам
    score.x = -score.width / 2;
    score.y = -score.height / 2 - 1;
    // добавляем очки в игровую сцену
    scoreBar.addChild(score);

// Добавление таргет цели
    target = new Sprite(id["cookie.png"]);
    target.x = gameScene.width / 2;
    target.y = gameScene.height / 2;
    // свойство сообщающее что это интерактивный обьект
    target.interactive = true;
    // свойство сообщающее что этот обьект - кнопка
    target.buttonMode = true;
    // добавляем обработчик события, через метод on задаем событие и обработчик handlerClick
    target.on("pointerdown", handlerClick);
    // добавляем печеньку в игровую сцену
    gameScene.addChild(target);

    // в state записываем функцию, которая должна работать каждый тик нашей игры
    state = play;
    //добавляем в тикер игровой цикл
    app.ticker.add(delta => gameLoop(delta));

}

// каждый тик вызывает функцию state, а в state записана функция play
function gameLoop(delta) {
    state(delta);
}

function play() {
    if (timer == 0) {
        targetClick = true;

        target.scale.x = 1;
        target.scale.y = 1;
    } else if (timer > 0) {
        timer--;
    }
}

// обработчик события handlerClick
function handlerClick() {
    if (targetClick) {
        value++;
        score.text = value;

        score.x = -score.width / 2;
        score.y = -score.height / 2;

        target.scale.x = 0.95;
        target.scale.y = 0.95;

        targetClick = false;

        timer = 10;
    }
}