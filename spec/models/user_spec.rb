# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  email           :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  password_digest :string(255)
#  remember_token  :string(255)
#

require 'spec_helper'

describe User do
  
  before { @user = User.new(name: "Jake Dean", email: "jdean@example.com",
  	                        password: 'foobar', password_confirmation: 'foobar')}

  subject { @user }

  it { should respond_to(:name) }
  it { should respond_to(:email) }
  it { should respond_to(:password_digest) }
  it { should respond_to(:password) }
  it { should respond_to(:password_confirmation) }
  it { should respond_to(:authenticate) }
  

  it { should be_valid }
  

  

  describe "when a name is not present" do
  	before { @user.name = " " }
  	it { should_not be_valid }
  end

  describe "when an email address is not present" do
  	before { @user.email = " " }
  	it { should_not be_valid }
  end

  describe "when a name is too long" do
  	before { @user.name = "a" * 51 }
  	it { should_not be_valid }
  end

  describe "when an email should be invalid" do

  	it "should not be valid" do

  	addresses = %w[jake@gmail.com jake07@gmail.com jake@gmail.] 
  	addresses.each do |address|
  		@user.email = address
  		@user.should_not be_valid
  	 end
  	end

  	it "should be valid" do
  		addresses = %w[jbd74@cornell.edu] 
  	    addresses.each do |address|
  		  @user.email = address
  		  @user.should be_valid
  	 end
  	end
  end

  describe "when an email has already been taken" do
  	before do
  		user_with_dup_email = @user.dup
  		user_with_dup_email.email = @user.email.upcase
  		user_with_dup_email.save
  	end

  	it { should_not be_valid }
  end

describe "password stuff" do


  describe "when a password is not present" do
  	before { @user.password = @user.password_confirmation = " " }
  	it { should_not be_valid }
  end

  describe "when a password is too short" do
  	before { @user.password = @user.password_confirmation = "a" * 5 }
  	it { should_not be_valid }
  end

  describe "when password and password_confirmation do not match" do
  	before { @user.password_confirmation = "mismatch" }
  	it { should_not be_valid }
  end

  describe "when the password_confirmation is nil" do
  	before { @user.password_confirmation = nil }
  	it { should_not be_valid }
  end

  describe "password authentication stuff" do

	before { @user.save }
	let(:found_user) { User.find_by_email(@user.email) }

	describe "should be valid if the password matches" do
		it { should == found_user.authenticate(@user.password)}
	end

	describe "should not be valid if the password does not match" do
		let(:invalid_user) { found_user.authenticate('invalid') }

		it { should_not == invalid_user }
		specify { invalid_user.should be_false }
	end
  end
 end

 




