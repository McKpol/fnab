#[cfg_attr(mobile, tauri::mobile_entry_point)]

use std::fs;
use std::fs::{OpenOptions};
use std::io::{self, SeekFrom, prelude::*, Result};
use std::path::Path;

static CONFIG_FILL: [[&str; 3]; 1] = [["0","0","0"]];
static FILENAME: [& str; 1] = ["configfile"];

fn create_files() -> Result<()> {
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

pub fn run() {
  match create_files() {
    Ok(_) => println!("Created {:#?}", FILENAME),
    Err(e) => println!("Error when creating savefile, Error: {}", e)
   }
 
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![reset_file, write_file, read_file])
    .plugin(tauri_plugin_process::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn reset_file(which: usize){
  match fs::remove_file(format!("{}", FILENAME[which])){
    Ok(_) => print!(""),
    Err(e) => println!("Error when reseting save (1/2, Deleting), Error: {}", e)
  }
  match create_files() {
    Ok(_) => println!("Created {}", FILENAME[which]),
    Err(e) => println!("Error when reseting save (2/2, Creating), Error: {}", e)
   }
}

#[tauri::command]
fn write_file(line: usize, content: &str, which: usize) {
  fn write(line: usize, content: &str, which: usize) -> io::Result<()> {
  let mut config_fill = CONFIG_FILL[which];
  let mut file = OpenOptions::new().read(true).write(true).open(FILENAME[which])?;
  let mut read = String::new();
  file.read_to_string(&mut read)?;

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
  match write(line, content, which){
    Ok(_) => println!("Writed {}, line {}, to file {}", content, line, FILENAME[which]),
    Err(e) => println!("Error when writing save, Error: {}", e)
  }
}

#[tauri::command]
fn read_file(line: usize, which: usize) -> String{
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