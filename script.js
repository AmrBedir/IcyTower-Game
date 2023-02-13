let my_translatey = -4
let my_translatex = 0
let left_down = false
let right_down = false
let bars = []
let score = 0
let align_items = ["center", "flex-start", "flex-end"]
let game_depth = 0
let started_scrolling = false
let player_fell = false
let ending_sec = 0
let bars_count = 0
class Bar{
    constructor(id, element){
        this.id = id
        this.element = element
        this.gave_score = false
    }

}

function startGame(){
    gravity()
    for(i=0;i<=5;i++){
        createBar()
    }
}
function createBar(){
    bars_count++
    new_bar_element_container = document.createElement("div")
    new_bar_element_container.className = "bar_container"
    new_bar_element_container.id = `bar${bars_count}container`
    new_bar_element = document.createElement("div")
    new_bar_element.className = "bar"
    new_bar_element.style.width = `${Math.floor(Math.random() * (60 - 25) + 25)}%`
    new_bar_element.id = `bar${bars_count}`
    new_bar_element_container.style.alignItems =  align_items[Math.floor(Math.random() * align_items.length)];
    new_bar_element_container.appendChild(new_bar_element)
    document.getElementById("game").appendChild(new_bar_element_container)
    new_bar = new Bar(bars_count, new_bar_element)
    bars.push(new_bar)
}
function determineMove(){
    code = window.event.keyCode
    if(code == 37 && !left_down){
        left_down = true
        move("left")
    }
    else if(code == 39 && !right_down){
        right_down = true
        move("right")
    }
    else if((code == 32 || code == 38)){
        jump()
    }
}
function collideWith(element){
    playerRect = document.getElementById("player").getBoundingClientRect()
    elementRect = element.getBoundingClientRect()
    collide = !(
        ((elementRect.top + elementRect.height) < (playerRect.top)) ||
        (elementRect.top > (playerRect.top + playerRect.height)) ||
        ((elementRect.left + elementRect.width) < playerRect.left) ||
        (elementRect.left > (playerRect.left + playerRect.width))
    )
    return collide
}
function makeKeyChanges(){
    code = window.event.keyCode
    if(code == 37){
        left_down = false
    }else if(code == 39){
        right_down = false
    }
}
function gravity(){
    gravity_interval = setInterval(() => {
        if(player_fell){
            clearInterval(gravity_interval)
        }
        if(!collideWith(document.getElementById("floor")) && !touchingBar(document.getElementById("bar1")) && !touchingBar(document.getElementById("bar2")) && !touchingBar(document.getElementById("bar3"))){
            my_translatey++
        }
        document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)` 

    },30);
}

    
function getBar(element){
    for(bar of bars){
        if (bar.element == element){
            return bar
        }
    }
}


function touchingBar(){
    loop_count = 0
    bar_elements = document.querySelectorAll(".bar")
    bar_elements_array = Array.from(bar_elements)
    bar_elements_array = bar_elements_array.reverse()
    playerRect = document.getElementById("player").getBoundingClientRect()
    for(bar_element of bar_elements_array){
        bar_of_element = getBar(bar_element)
        if(loop_count <= 5){
            barRect = bar_element.getBoundingClientRect()
            if(!(
                ((barRect.top + barRect.height) < (playerRect.top)) ||
                (barRect.top > (playerRect.top + playerRect.height)) ||
                ((barRect.left + barRect.width) < playerRect.left) ||
                (barRect.left > (playerRect.left + playerRect.width)) ||
                (barRect.top + barRect.height) < (playerRect.bottom)
            )){
                if(!eval(bar_element.id).gave_score){
                    score++
                    document.getElementById("score").innerText = `Score: ${score}`
                    eval(bar_element.id).gave_score = true
                    if(bar_of_element.id == 3){
                        ending_game = setInterval(() => {
                            clearInterval(screen_down)
                            clearInterval(gravity_interval)
                        }, 4000);
                        screenDown()
                        createBar()
                        createBar()
                        createBar()
                        createBar()
                        createBar()
                    }
                    if(bar_of_element.id >= 4){
                        clearInterval(ending_game)
                        ending_game = setInterval(() => {
                            clearInterval(screen_down)
                            clearInterval(gravity_interval)
                            window.onkeydown = ""
                        }, 4000);
                        if(!started_scrolling){
                            screenDown()
                        }
                        createBar()
                    }
                }
                return true
            }
        }
    }
    return false
}

function screenDown(){
    started_scrolling = true
    screen_down = setInterval(() => {
        game_depth += 0.1
        document.getElementById("game").style.transform = `translatey(${game_depth}vw)`
    }, 5);
}
function jump(){
    code = window.event.keyCode
    if((code == 32 || code == 38) && (collideWith(document.getElementById("floor")) || touchingBar())){
        interval_count = 0
        let jump_interval = setInterval(() => {
            if(interval_count < 50){
                my_translatey -= 0.5
                document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)`
                interval_count++
            }else{
                clearInterval(jump_interval)
                console.log("condition")
            }

        },5);
    }
}
function move(direction){
    code = window.event.keyCode
    if(document.getElementById("player").style.transform == ""){
        document.getElementById("player").style.transform = `translatey(0vw) translatex(0vw)`
    }
    if(direction == "right"){
            right_interval = setInterval(() => {
            if(right_down){
                if(!collideWith(document.getElementById("right_wall"))){
                    my_translatex += 1.5
                    document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)`
                    if(collideWith(document.getElementById("right_wall"))){
                        my_translatex -= 1.5
                        document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)`
                    }  
                }
            }else{clearInterval(right_interval)}
        }, 20);
    }
    else if(direction == "left"){
        left_interval = setInterval(() => { 
            if(left_down){
                if(!collideWith(document.getElementById("left_wall"))){
                    my_translatex -= 1.5
                    document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)`   
                    if(collideWith(document.getElementById("left_wall"))){
                        my_translatex += 1.5
                        document.getElementById("player").style.transform = `translatey(${my_translatey}vw) translatex(${my_translatex}vw)`
                    }  
                }
            }else{clearInterval(left_interval)}
        }, 20);
    }
}
function playAgain(){
    location.reload()
}
window.onload = startGame
window.onkeydown = determineMove
window.onkeyup = makeKeyChanges
