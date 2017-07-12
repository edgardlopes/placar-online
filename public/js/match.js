const videoTemplate = Handlebars.compile($('#video-template').html())
const bidTemplate = Handlebars.compile($('#bid-template').html())

$(function() {
    const socket = io('', {query: {match: MATCH_INDEX}})
    socket.on('connect', function(){
        console.log('connected')
    })

    socket.on('score', function (score) {
        console.log('score', score)
        //atualiza na lista
        $('.match-' + score.match + '-a').html(score.scoreA)
        $('.match-' + score.match + '-b').html(score.scoreB)

        //atualiza o jogo
        if(MATCH_INDEX === score.match){
            $('.score-team-a').html(score.scoreA)
            $('.score-team-b').html(score.scoreB)           

            if(score.notify){
                $('#audio-gol')[0].currentTime = 0
                $('#audio-gol')[0].play()  

                $('.goooolllll').addClass('goooolllll-anim')
                $('.goooolllll-text').addClass('goooolllll-text-anim')
                $('.goooolllll-text').on('transitionend webkitTransitionEnd oTransitionEnd', function (){
                    $('.goooolllll').removeClass('goooolllll-anim')
                    $('.goooolllll-text').removeClass('goooolllll-text-anim')                    
                })
                   
            } 
        }
    })


    $('#na-torcida-a').click(function() {
        updateSupporters('a', function(data){
            console.log(data)
        })
        return false;
    })
    
    $('#na-torcida-b').click(function() {
        updateSupporters('b', function(data){
            console.log(data)
        })
        return false
    })

    socket.on('supporters', function(data){
        console.log('na torcida', data)
        $('.bar-team-a').css('width', data.teamA + "%")
        $('.bar-team-b').css('width', data.teamB + "%")        
    })

    socket.on('video', function(video){
        console.log(video)
        $('#videos-wrapper').append(videoTemplate({video}))
    })

    socket.on('bid', function(bid){
        console.log(bid)
        $('#bids-wrapper').prepend(bidTemplate(bid))
    })

    const updateSupporters = function(team, callback) {
        $.post('/match/' + MATCH_INDEX + '/supporters', {
            team: team
        }, callback)
    }
})