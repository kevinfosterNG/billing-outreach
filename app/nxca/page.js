'use client';

import { redirect } from 'next/navigation';
export default async function AppRedirect({ params }) {
    //redirect('https://l.linklyhq.com/l/1lWv0');
    try {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        console.log("android = ", userAgent);
        redirect("https://play.google.com/store/apps/details?id=com.nextcare.health")
       }
       else if (/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent))
        redirect("https://apps.apple.com/us/app/apple-store/id1629290318");
       else
        redirect("https://nextcare.com/nextcare-app/");
      
    }
    catch(e) {
      console.log(e);
    }

    


  // ...

  //else
  //https://nextcare.com/nextcare-app/
}