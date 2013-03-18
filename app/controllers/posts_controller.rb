class PostsController < ApplicationController

def new
  	@post = Post.new
  end

  def create
  	@post = Post.new(params[:post])
  	if @post.save
  		flash[:success] = "The post was added!"
  		redirect_to thoughts_path
  	else
  		render 'new'
  	end
  end


  def show
    @post = Post.find(params[:id])
  end

end