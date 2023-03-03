function validate()
{
    let password = document.getElementById('password').value;
    if (password == "12345")
    {
        window.open("https://jencz.github.io/button-clicker");
        return false;
    }
    else
    {
        alert("Invalid Password. Please try again.");
    }
}

function GetHelp() 
{
    let x = document.getElementById('Help');
    if (x.style.display == 'none') 
    {
        x.style.display = 'block';
    } 
    else 
    {
        x.style.display = 'none';
    }
}
