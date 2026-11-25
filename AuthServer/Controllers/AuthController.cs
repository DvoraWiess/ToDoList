using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;
using System.IdentityModel.Tokens.Jwt;
namespace TodoApi.Controllers;

[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ToDoDbContext _db;

    public AuthController(IConfiguration configuration, ToDoDbContext db)
    {
        _configuration = configuration;
        _db = db;
    }

    [HttpPost("/login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Username == loginModel.Username && u.Password == loginModel.Password);

        if (user is null)
        {
            return Unauthorized();
        }
        return Ok(CreateJWT(user));
    }

    [HttpPost("/register")]
    public async Task<IActionResult> Register([FromBody] LoginModel loginModel)
    {
        if (await _db.Users.AnyAsync(u => u.Username == loginModel.Username))
        {
            return BadRequest("שם המשתמש כבר קיים");
        }
        var newUser = new User
        {
            Username = loginModel.Username,
            Password = loginModel.Password
        };
        _db.Users.Add(newUser);
        await _db.SaveChangesAsync();
        return Ok(CreateJWT(newUser));
    }

    private object CreateJWT(User user)
    {
        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim("name", user.Username ?? "")
        };

        var secretKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var tokenOptions = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: signinCredentials
        );
        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        return new { Token = tokenString };
    }
}