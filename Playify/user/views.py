from django.shortcuts import render,redirect
from .forms import RegisterForm,LoginForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import login,authenticate,logout



# Create your views here.

def register(request):

    form = RegisterForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")

##        test_user = authenticate(username = username)
##
##       if test_user is not None:
##           messages.info(request,"This Username already Taken")
##           return render(request,"register.html",context)
##
     
        newUser = User(username = username)
        newUser.set_password(password)

        newUser.save()

        
        #newProfile = Profile(username = username, password = password)
        
        login(request,newUser)
        messages.success(request,"Sign Up Successfully...")

        return redirect("index")
    context = {
            "form" : form
        }
    return render(request,"register.html",context)

    
    
def loginUser(request):
    form = LoginForm(request.POST or None)

    context = {
        "form":form
    }

    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")

        user = authenticate(username = username,password = password)

        if user is None:
            messages.info(request,"Wrong Username or Password")
            return render(request,"login.html",context)

        messages.success(request,"Login Successfully")
        login(request,user)
        return redirect("index")
    return render(request,"login.html",context)
    
def logoutUser(request):
    logout(request)
    messages.success(request,"Logout Successfully")
    return redirect("index")

