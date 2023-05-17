use std::{collections::HashMap, sync::Arc};

use parking_lot::Mutex;
use tokio::{sync::mpsc::UnboundedSender, time::Instant};
use tokio_tungstenite::tungstenite::Message;

use crate::types::{BroadcastEvents, Connection};

pub struct Player {
  pub dt_last_send: Option<Instant>,
}

#[derive(Clone)]
pub struct Game {
  pub players: Arc<Mutex<HashMap<String, Player>>>, // username - ip:port
  pub broadcast_sender: UnboundedSender<BroadcastEvents>
}

impl Game {
  pub fn new(broadcast_sender: UnboundedSender<BroadcastEvents>) -> Game {
    Game { 
      players: Arc::new(Mutex::new(HashMap::new())),
      broadcast_sender,
    }
  }

  pub fn add_player(&self, username: String) {
    let mut players = self.players.lock();
    if !players.contains_key(&username) && players.len() < 50 {
      players.insert(username.clone(), Player { dt_last_send: None });
      self.broadcast_sender.send(BroadcastEvents::Join(username.clone())).unwrap();
    }
  }

  pub fn add_connection(&self, conn: Connection) {
    let _ = self.broadcast_sender.send(BroadcastEvents::AddConn(conn));
  }

  pub fn remove_player(&self, username: String, id: u32) {
    self.players.lock().remove(&username);
    let _ = self.broadcast_sender.send(BroadcastEvents::Quit(id, username));
  }

  pub fn get_list_message(&self) -> String {
    let list_string = self.players.lock().iter().map(|w| w.0.to_owned()).collect::<Vec<String>>().join(",");

    format!("LIST|{}", list_string)
  }

  pub fn send_file(&self, from: String,msg: Message) {
    let mut players = self.players.lock();
    if let Some(player) = players.get(&from) {
      if player.dt_last_send.is_none() || player.dt_last_send.unwrap().elapsed().as_secs() > 15 {
        let _ = self.broadcast_sender.send(BroadcastEvents::SendFile(msg));
        players.insert(from, Player { dt_last_send: Some(Instant::now()) });
      }
    }
  }
}