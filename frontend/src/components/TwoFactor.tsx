// export default function TwoFactor() {

//     return (
//         <div>
//             <h1>2FA AUTHENTICATION</h1>
//         </div>
//     )

// }

import React from 'react'

export class TwoFactor extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event: any) {
      this.setState({value: event.target.value});
    }
  
    async handleSubmit(event: any) {
    //   alert('Le nom a été soumis : ' + this.state.value);

    let res = await fetch('/api/auth/2fa/generate', {
        method: "POST",
        body: JSON.stringify({
            token: this.state.value
        }),
      });
      let resJson = await res.json();

      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            2fa code :
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    }
  }
