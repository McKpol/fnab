#[cfg_attr(mobile, tauri::mobile_entry_point)]

use std::fs;
use std::fs::{File, OpenOptions};
use std::io::{self, SeekFrom, prelude::*, Result};
use std::path::Path;

use tauri::utils::config;

static CONFIG_FILL: [&str; 3] = ["0","0","0"];
static SAVENAME: &str = "savefile";

fn create_save() -> Result<()> {
  if !Path::new("savefile").exists(){
    let config_fill = CONFIG_FILL;
    let mut file = OpenOptions::new().write(true).create(true).open(SAVENAME)?;
    file.write_all(b"")?;
    for set in config_fill {
      writeln!(file, "{}", set)?;
    }}
    
  Ok(())
}

pub fn run() {
  match create_save() {
    Ok(_) => println!("Created {}", SAVENAME),
    Err(e) => println!("Error when creating savefile, Error: {}", e)
   }
 
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![reset_save, write_save])
    .plugin(tauri_plugin_process::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn reset_save(){
  match fs::remove_file(format!("{}", SAVENAME)){
    Ok(_) => print!(""),
    Err(e) => println!("Error when reseting save (1/2, Deleting), Error: {}", e)
  }
  match create_save() {
    Ok(_) => println!("Created {}", SAVENAME),
    Err(e) => println!("Error when reseting save (2/2, Creating), Error: {}", e)
   }
}

#[tauri::command]
fn write_save(line: usize, content: &str) {
  fn write(line: usize, content: &str) -> io::Result<()> {
  let mut config_fill = CONFIG_FILL;
  let mut file = OpenOptions::new().read(true).write(true).open(SAVENAME)?;
  let mut read = String::new();
  file.read_to_string(&mut read)?;

  let mut i = 0;
  for line in read.lines(){
    println!("{}", line);
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
  fs::write(SAVENAME, "")?;
  for line in config_fill{
    
    writeln!(file, "{}", line)?;
  }
  Ok(())
}
  match write(line, content){
    Ok(_) => println!("Writed"),
    Err(e) => println!("Error when writing save, Error: {}", e)
  }
}