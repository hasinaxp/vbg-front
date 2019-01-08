admin->
games: add, remove, change_image

client->
login:
    sign_in: (email, password/ fb /google) => user_id, connenction_string, email
    sign_out: connenction_string->reset

dashboard:
    game : add, remove, change_connenct_string
    search: (game_id, text)=> users_list<game, sorted-> last_login>
    challenge: (game_id, user_id, bet) => confirmation
                :cancel -> matches.pop()
                :accept -> match.state = 1
    data:() |time-> ascending => challenge_list(state: 0),
                                 match_list_normal(state: 1),
                                match_list_tournament(state: 1),
                                games
                                feeds
match:
    data:() => match.populate(challenger, challenged, game)
    chat!!
    admit_defeat: () => consfirmation
    claim_victory: (image) => consfirmation
    admin_request:


