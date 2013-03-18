class StaticPagesController < ApplicationController
  
  def home
  end
  
  def about_me
  end

  def projects

  end

  def thoughts
  	@post = Post.new
  	@posts = Post.all

  end

  def about
  end
end
