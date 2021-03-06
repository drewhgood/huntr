# Homepage (Root path)
require_relative 'helpers'

before do
  if session[:user_id]
    @current_user = User.find(session[:user_id])
  end
end

get '/' do
  if session[:user_id]
    @current_user = User.find(session[:user_id])
  end
  @hunts = Hunt.all
  erb :'index'

end

post '/user_sessions' do 

  @current_user = User.find_by(email: params[:email])

  if @current_user and @current_user[:password] == params[:password]
    session.clear
    session[:user_id] = @current_user[:id]
    redirect '/'
  else
    redirect '/users/new'
  end
end

delete '/user_sessions' do
  session.clear
  redirect '/'
end

get '/users' do
  #get all users 
  @users = User.all
  erb :'users/index'
end

post '/users' do
  #creates a new user
  @user = User.create(email: params[:email], nickname: params[:nickname], password: params[:password])
  session[:user_id] = @user[:id]
  redirect '/'
end

get '/users/new' do
  @user = User.new()
  erb :'users/new'
  #form to create new user
end

get '/users/:id/edit' do
  #form to edit :id
  "<h1>under maintanance</h1>"
end

get '/users/:id' do
  #show specific user
    redirect '/'
end

put '/users/:id' do
  # - Replaces user :id (probable after edit)

end

delete '/users/:id' do  
  # delete user :id
  "<h1>under maintanance</h1>"
end

########## Hunts REST 

get '/hunts' do
  #get all hunts
  # redirect '/' if !@current_user
  @hunts = Hunt.all
  erb :'hunts/index'
end

post '/hunts' do


  redirect '/' if !@current_user  

  @new_hunt = Hunt.create(name: params[:name], 
                      level: params[:difficulty], 
                      city: params[:starting_location], 
                      description: params[:description], 
                      user_id: @current_user.id)

   num_loc = (params.size - 4)/6
  
   1.upto(num_loc) do |i|

    location_num = params.select { |k,v| k[-1]== i.to_s }
  
    @new_location = Location.create!(hunt_id: @new_hunt.id, name: "empty", lat: location_num["lat_#{i}"], lon: location_num["lng_#{i}"], clue: location_num["clue_#{i}"])
            @hint1 = Hint.create!(location_id: @new_location.id, body: location_num["hint_1_#{i}"])
            @hint1 = Hint.create!(location_id: @new_location.id, body: location_num["hint_2_#{i}"])
            @hint1 = Hint.create!(location_id: @new_location.id, body: location_num["hint_3_#{i}"])
  
  end



  redirect '/hunts'
end

get '/hunts/new' do
  #form to create new user
  redirect '/' if !@current_user
  erb :'hunts/new'
  
end

get '/hunts/:id/edit' do
  #form to edit :id
  redirect '/' if !@current_user
end

get '/hunts/:id' do
  #show specific user
  # redirect '/' if !@current_user
  begin
    @hunt = Hunt.find(params[:id])  

    top_huntrs(@hunt)

    erb :'hunts/id'
  rescue ActiveRecord::RecordNotFound
    redirect '/hunts'
  end
end

put '/hunts/:id' do
  # - Replaces user :id (probable after edit)

  redirect '/' if !@current_user
end

delete '/hunts/:id' do  
  # delete user :id
  redirect '/' if !@current_user
end

########## PlaySession REST 

get '/play_sessions' do
  #get all play_session for the current_user
  redirect '/' if !@current_user
  @play_sessions = PlaySession.where(user_id: @current_user.id)
  erb :'play_sessions/index'
end

post '/play_sessions' do
  #creates play_session
  redirect '/' if !@current_user
  @hunt = Hunt.find(params[:hunt_id])
  
  @play_session = PlaySession.create(user_id: @current_user.id,
                              hunt_id: params[:hunt_id],
                              location_id: @hunt.locations.first.id)
  
  redirect "/play_sessions/#{@play_session.id}"
end

get '/play_sessions/new' do
  #form to create new user
  redirect '/' if !@current_user
  @hunts = user_available_hunts
  erb :'play_sessions/new'
end

get '/play_sessions/:id' do
  #show specific user
  redirect '/' if !@current_user
  begin
    @play_session = PlaySession.find(params[:id])
    redirect '/' if @current_user.id != @play_session.user_id
    @hunt = Hunt.find(@play_session.hunt_id)

    @hints = hints_to_display(@play_session)
    erb :'play_sessions/id'
  rescue ActiveRecord::RecordNotFound
    redirect '/'
  end
end

get '/play_sessions/:id/edit' do
  #form to edit :id
  
  redirect '/' if !@current_user
end

put '/play_sessions/:id' do
  # - Replaces user :id (probable after edit)
  redirect '/' if !@current_user

  @play_session = PlaySession.find(params[:id])

  play_session_next_hint(@play_session) if params[:hint_request] == 'true'
  result = @play_session.check_answer([params[:guess_lat], params[:guess_lon]])

  play_session_next_location(@play_session) if result 

  redirect "/play_sessions/#{params[:id]}"
end

delete '/play_sessions/:id' do  
  # delete user :id
  redirect '/' if !@current_user
end
