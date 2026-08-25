package com.cinema;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class TestJwt {
    public static void main(String[] args) {
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc4NzU1OTg2MywiZXhwIjoxNzg3NjQ2MjYzfQ.hFUHGtTPu1P70_UI1XM54qdGYTMy7DqO4eXQG2UeQtE";
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        Key key = Keys.hmacShaKeyFor(keyBytes);
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Expiration: " + claims.getExpiration());
            System.out.println("Current Time: " + new Date(System.currentTimeMillis()));
            System.out.println("Is Expired: " + claims.getExpiration().before(new Date(System.currentTimeMillis())));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
