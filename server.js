import fetch from 'node-fetch';
import fs from 'fs';

fetch("https://pokeapi.co/api/v2/pokemon?limit=2000")
    .then((res)=>{
        return res.json();
    }).then((data)=>{
        let pokemonList = data.results;
        for(let pokemon of pokemonList){
            let { name } = pokemon;
            fetch("https://pokeapi.co/api/v2/pokemon/" + name)
                .then((res)=>{
                    return res.json();
                }).then(async(data)=>{
                    let {id, name, weight, height, sprites, stats} = data;

                    let hp;
                    let atk;
                    let def;
                    for(let statObj of stats){
                        if(statObj.stat.name === "hp"){
                            hp = statObj.base_stat;
                        } else if(statObj.stat.name === "attack"){
                            atk = statObj.base_stat;
                        } else if(statObj.stat.name === "defense"){
                            def = statObj.base_stat;
                        }
                    }
                    let pokeObj = {
                        id,
                        name: name[0].toUpperCase() + name.slice(1).toLowerCase(),
                        weight: Math.round(Number(weight)/4.536),
                        height: Math.round(Number(height)/3.048),
                        image:sprites.front_default,
                        hp,
                        atk,
                        def
                    }
                    fs.appendFile('data.json', JSON.stringify(pokeObj)+",", function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                });
        }
    }).catch((err)=>{
        console.log(err);
    });