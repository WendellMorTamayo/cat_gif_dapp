use anchor_lang::prelude::*;

declare_id!("FjwoJ35JBcJJXB5dVfY2EjU2fNXZSgVi1whNXWadFzsi");

#[program]
pub mod cat_gif_contract {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result <()> {
    // Get a reference to the account.
    let base_account: &mut Account<'_, BaseAccount> = &mut ctx.accounts.base_account;
    // Initialize total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }

  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    // Get a reference to the account.
    let base_account: &mut Account<'_, BaseAccount> = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
      reactor_count: 0,
      transaction_hash: ctx.accounts.user.key().to_string(),
    };

    // Increment total_gifs.
    base_account.gif_list.push(item);
    base_account.total_gifs += 1;
    Ok(())
  }

  pub fn add_reaction(ctx: Context<BaseUser>, gif_index: String) -> Result <()> {
      // Get refernce to the account, also user
      let base_account: &mut Account<'_, BaseAccount> = &mut ctx.accounts.base_account;
      let user = &mut ctx.accounts.user;
      // Upvote if user hasn't reacted yet
      if !base_account.reactors.contains(&*user.to_account_info().key) {
          let index: usize = gif_index.parse().unwrap();
          let gif_item = &mut base_account.gif_list[index];
          gif_item.reactor_count += 1;
          base_account.reactors.push(*user.to_account_info().key);
      }
      Ok(())
  }

  pub fn delete_gif(ctx: Context<DeleteGif>, gif_link: String, pub_key: String) -> Result <()> {
      let base_account = &mut ctx.accounts.base_account;
      // Find the index of the GIF with the given link.
      let gif_index = base_account
          .gif_list
          .iter()
          .position(|gif| gif.gif_link == gif_link)
          .ok_or(ErrorCode::GifNotFound)?;
      // Ensure that the public key matches the owner of the GIF (if needed).
      if base_account.gif_list[gif_index].user_address.to_string() != pub_key {
          return Err(ErrorCode::Unauthorized.into());
      }
      base_account.gif_list.remove(gif_index);
      base_account.total_gifs -= 1;
      Ok(())
  }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct BaseUser<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub reactor_count: u64,
    pub transaction_hash: String,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
    pub reactors: Vec<Pubkey>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized to delete this GIF.")]
    Unauthorized,
    #[msg("Gif not found.")]
    GifNotFound,
}


