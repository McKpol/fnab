
static CONFIG_FILL: [[&str; 4]; 1] = [["0","0","0","0"]];
static FILENAME: [& str; 1] = ["configfile"];
use std::fs::{self, OpenOptions};
use std::io::{self, SeekFrom, prelude::*, Result};
use std::path::Path;
use tauri::{AppHandle, Emitter};

    pub fn create_files() -> Result<()> {
        let mut i = 0;
        let filename = FILENAME;
        for name in filename{
        if !Path::new(name).exists(){
            let config_fill = CONFIG_FILL[i];
            let mut file = OpenOptions::new().write(true).create(true).open(name)?;
            file.write_all(b"")?;
            for set in config_fill {
            writeln!(file, "{}", set)?;
            }}
            i+=1;
        }
    
        
        Ok(())
    }

    #[tauri::command]
    pub fn reset_file(which: usize){
    match fs::remove_file(format!("{}", FILENAME[which])){
        Ok(_) => print!(""),
        Err(e) => println!("Error when reseting save (1/2, Deleting), Error: {}", e)
    }
    match create_files() {
        Ok(_) => println!("Restarted {}", FILENAME[which]),
        Err(e) => println!("Error when reseting save (2/2, Creating), Error: {}", e)
    }
    }

    #[tauri::command]
    pub fn write_file(line: usize, content: &str, which: usize, app: AppHandle) {
    fn write(line: usize, content: &str, which: usize, app: AppHandle) -> io::Result<()> {
    let mut config_fill = CONFIG_FILL[which];
    let mut file = OpenOptions::new().read(true).write(true).open(FILENAME[which])?;
    let mut read = String::new();
    file.read_to_string(&mut read)?;

    // Collect lines into a Vec<String>
    let lines: Vec<String> = read.lines().map(|line| line.to_string()).collect();

    if config_fill.len() != lines.len(){
        reset_file(which);
        app.emit("writefile", which).unwrap();
        return Err(io::Error::new(io::ErrorKind::InvalidData, format!("{} is corrupted, resetting file.", FILENAME[which])));
    }

    let mut i = 0;
    for line in read.lines(){
        config_fill[i] = line;
        i += 1;
    }
    if config_fill[line] == content{
        println!("Nothing changed");
        return Ok(());
    }
    
    file.set_len(0)?;
    file.seek(SeekFrom::Start(0))?;

    config_fill[line] = content;
    fs::write(FILENAME[which], "")?;
    for line in config_fill{
        
        writeln!(file, "{}", line)?;
    }
    Ok(())
    }
    match write(line, content, which, app){
        Ok(_) => println!("Writed {}, line {}, to file {}", content, line, FILENAME[which]),
        Err(e) => println!("Error when writing save, Error: {}", e)
    }
    }

    #[tauri::command]
    pub fn read_file(line: usize, which: usize) -> String{
    fn read(line: usize, which: usize) -> io::Result<String>{
        let mut file = OpenOptions::new().read(true).open(FILENAME[which])?;
        let mut read = String::new();
        file.read_to_string(&mut read)?;

        let lines: Vec<&str> = read.lines().collect();
        if line < lines.len() {
            Ok(lines[line].to_string())
        } else {
            Err(io::Error::new(io::ErrorKind::InvalidInput, "Line number out of range"))
        }
    }
    let mut out: String = "".to_string();
    match read(line, which){
        Ok(s) => out = s,
        Err(e) => println!("Error when reading save, Error: {}", e)
    }

    out
    }