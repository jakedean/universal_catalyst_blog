require 'spec_helper'

  describe "StaticBlogPages" do
  	subject {page}
  	
    describe "Home page" do

      before {visit root_path}
  	  
  		it {should have_content('Jacob Dean')}
      it {should have_selector('title', :content => full_title('Home'))}
      
   end

   
  	describe "About me page" do
  	
  		before {visit about_me_path}

  		it {should have_content('About Me')}
      it { should have_selector('title', :content => full_title('About Me')) }
      
   end

  
  	describe "About the site page" do
  	  
  		before {visit about_the_site_path} 

  		it {should have_content('About')}
      it {should have_selector('title', :content => full_title('About the Site'))}
    
   end

    describe "My projects page" do
  	 
  		before {visit my_projects_path}

  		it {should have_content('My Projects')}
      it {should have_selector('title', :content => full_title('My Projects'))}


      describe "for signed-in users" do
      let(:user) { FactoryGirl.create(:user) }
      before do
        FactoryGirl.create(:micropost, user: user, content: "Lorem ipsum")
        FactoryGirl.create(:micropost, user: user, content: "Dolor sit amet")
        sign_in user
        visit my_projects_path
      end

      it "should render the user's feed" do
        user.feed.each do |item|
          page.should have_selector("li##{item.id}", text: item.content)
        end
      end

      describe "follower/following counts" do
        let(:other_user) { FactoryGirl.create(:user) }
        before do
         other_user.follow!(user) 
         visit my_projects_path
        end

        it { should have_link("0 following", href: following_user_path(user)) }
        it { should have_link("1 followers", href: followers_user_path(user)) }

      end
    end
   end

    describe "My thoughts page" do
  	 
  		before {visit my_thoughts_path}
  		
      it {should have_content('My Projects')}
      it {should have_selector('title', :content => full_title('My Projects'))}
   end


end


