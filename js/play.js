$(function() {
    var pg = new puzzleGame(
        '#imgArea',
        'img/puzzle.jpg'
    )
    //检测游戏状态
    function checkGameStart(noGame, hasGame) {
        if (pg.getGameStatus()) {
            //游戏复位
            if (confirm('已经在游戏中，确定要重新开始？')) {
                hasGame()
            }
        } else {
            noGame()
        }
    }
    $("#start").click(function() {
        var $button = $(this).find('button')
        checkGameStart(function() {
            pg.startGame(function(){
                alert('真棒，这都没难倒你，恭喜成功完成本次游戏！！！')
            })
            $button.text('游戏中')
        }, function() {
            pg.resetGame()
            $button.text('游戏开始')
        })
    })
    $('.target').change(function(evt) {
        var $button = $("#start").find('button')
        var $val = $.parseJSON($(this).val())
        checkGameStart(function() {
            pg.setGameLevel($val.row, $val.col)
        }, function() {
            pg.resetGame($val.row, $val.col)
            $button.text('游戏开始')
        })
    })
});